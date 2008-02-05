#    create_table :articles do |t|
#      # t.column :name, :string
#      t.column :title, :string
#      t.column :source_text, :text
#      # automated stuff
#      t.column :created_on, :datetime
#      t.column :lock_version, :integer, :default => 0 
#    end
class Article < ActiveRecord::Base
  include XmlSourceProcessor
  before_update :process_source

  validates_presence_of :title

  has_and_belongs_to_many :categories
  belongs_to :collection
  has_many(:target_article_links,
           { :foreign_key => "target_article_id",
             :class_name => 'ArticleArticleLink' })
  has_many(:source_article_links,
           { :foreign_key => "source_article_id",
             :class_name => 'ArticleArticleLink' })
  has_many :page_article_links
  has_many :pages, :through => :page_article_links
  has_many :article_versions, :order => :version

  
  after_save :create_version

  @title_dirty = false

  def title=(title)
    @title_dirty = true
    super
  end

  #######################
  # XML Source support
  #######################
  def clear_links
    # clear out the existing links to this page
    ArticleArticleLink.delete_all("source_article_id = #{self.id}")     
  end

  def create_link(article, display_text)
    link = ArticleArticleLink.new(:source_article => self,
                                  :target_article => article,
                                  :display_text => display_text)
    link.save!
    return link.id        
  end
  

  #######################
  # Version support
  #######################
  def create_version
    if !@text_dirty or !@title_dirty
      return
    end
    version = ArticleVersion.new
    # copy article data
    version.title = self.title
    version.xml_text = self.xml_text
    version.source_text = self.source_text
    # set foreign keys
    version.article = self
    version.user = User.current_user
    
    # now do the complicated version update thing
    previous_version = 
      ArticleVersion.find(:first, 
                       :conditions => ["article_id = ?", self.id],
                       :order => "version DESC")
    if previous_version
      version.version = previous_version.version + 1
    end
    version.save!      
  end
end