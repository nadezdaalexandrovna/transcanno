class DisplayController < ApplicationController
  public :render_to_string

  protect_from_forgery :except => [:set_note_body]

  PAGES_PER_SCREEN = 5

  def read_work
    if params.has_key?(:work_id)
      @work = Work.find_by(id: params[:work_id])
    elsif params.has_key?(:url)
      @work = Work.find_by_id(params[:url][:work_id])
    end
    @total = @work.pages.count
    if @article
      # restrict to pages that include that subject
      redirect_to :action => 'read_all_works', :article_id => @article.id, :page => 1 and return
    else
      if params['needs_review']
        condition = "work_id = ? AND status = ?"
        @pages = Page.order('position').where(condition, params[:work_id], 'review').paginate(page: params[:page], per_page: PAGES_PER_SCREEN)
        @count = @pages.count
      elsif params['translation_review']
        condition = "work_id = ? AND translation_status = ?"
        @pages = Page.order('position').where(condition, params[:work_id], 'review').paginate(page: params[:page], per_page: PAGES_PER_SCREEN)
        @count = @pages.count
      else
        @pages = Page.order('position').where(:work_id => @work.id).paginate(page: params[:page], per_page: PAGES_PER_SCREEN)
        @count = @pages.count
      end
    end

    connection = ActiveRecord::Base.connection
    sql = "SELECT categories.id, categories.title FROM categories INNER JOIN `headercategories` ON categories.id=headercategories.category_id WHERE headercategories.is_header_category=1 AND categories.collection_id=" + @collection.id.to_s;
    headercategoriesAll = connection.execute(sql)
    @headercategories = []
    headercategoriesAll.each do |hc|
      @headercategories << [hc[0], hc[1], 0]
    end

  end

  def read_all_works
    if @article
      # restrict to pages that include that subject
      @pages = Page.order('work_id, position').joins('INNER JOIN page_article_links pal ON pages.id = pal.page_id').where([ 'pal.article_id = ?', @article.id ]).paginate(page: params[:page], per_page: PAGES_PER_SCREEN)
      @pages.uniq!
    else
      @pages = Page.paginate :all, :page => params[:page],
                                        :order => 'work_id, position',
                                        :per_page => 5
    end
  end

  def search
    if @article
      # get the unique search terms
      terms = []
      @search_string = ""
      @article.page_article_links.each do |link|
        terms << link.display_text.gsub(/\s+/, ' ')
      end
      terms.uniq!
      # process them for display and search
      terms.each do |term|
        # don't add required text
        if term.match(/ /)
          @search_string += "\"#{term}\" "
        else
          @search_string += term + "* "
        end
      end

      if params[:unlinked_only]
        conditions =
          ["works.collection_id = ? "+
          "AND MATCH(search_text) AGAINST(? IN BOOLEAN MODE)"+
          " AND pages.id not in "+
          "    (SELECT page_id FROM page_article_links WHERE article_id = ?)",
          @collection.id,
          @search_string,
          @article.id]

      else
        conditions =
          ["works.collection_id = ? "+
          "AND MATCH(search_text) AGAINST(? IN BOOLEAN MODE)",
          @collection.id,
          @search_string]
      end
      @pages = Page.order('work_id, position').joins(:work).where(conditions).paginate(page: params[:page])
    else
      
      @search_string = params[:search_string].clone

      search_s = params[:search_string].clone
      @whole_word = params[:whole_word]

      @headercategories = []
      hcFromParams = Set.new # Will contain headercategories that were checked by the user

      regexpHeaderCats = ""
      @in_transc = params[:in_transc]
      @in_text = params[:in_text]

      if params[:header_cat]
        params[:header_cat].each do |hc|
          hc_array = hc.split(" ")
          @headercategories << [hc_array[0], hc_array[1], 1]
          hcFromParams.add(hc_array[0])
        end
      end

      if params[:header_cat] and (!params[:in_text] or params[:in_text]=="0") # looking only in the header categories' values
        @headercategories.each do |hc_array|
          regexpHeaderCats += hc_array[1]+"|"
        end

        regexpHeaderCatsBefore = "<(" + regexpHeaderCats[0...-1] + ")>"
        regexpHeaderCatsAfter = "</(" + regexpHeaderCats[0...-1] + ")>"

        if @whole_word
          search_s.gsub!(/(\S+)/, regexpHeaderCatsBefore + '\1' + regexpHeaderCatsAfter)
        else
          search_s.gsub!(/(\S+)/, regexpHeaderCatsBefore + '[^<]*\1[^<]*' + regexpHeaderCatsAfter)
        end

      elsif params[:in_transc]=="1" # looking only in the text of the transcription including tags
        if @whole_word
          search_s.gsub!(/(\S+)/, '</textinfoheader>' + '.*[^[:alnum:]]\1($|[^[:alnum:]])')
        else
          search_s.gsub!(/(\S+)/, '</textinfoheader>' + '.*\1')
        end
      else #looking in header categories values and/or only in the transcription text excluding tags
        if @whole_word
          search_s.gsub!(/(\S+)/, '(^|[^[:alnum:]]+)\1($|[^[:alnum:]]+)')
        end
      end

      connection = ActiveRecord::Base.connection
      sql = "SELECT categories.id, categories.title FROM categories INNER JOIN `headercategories` ON categories.id=headercategories.category_id WHERE headercategories.is_header_category=1 AND categories.collection_id=" + @collection.id.to_s;
      headercategoriesAll = connection.execute(sql)
      #Add the headercategories that were not checked by the user
      headercategoriesAll.each do |hc|
        unless hcFromParams.include?(hc[0].to_s)
          @headercategories << [hc[0], hc[1], 0]
        end
      end

      if search_s
        if params[:header_cat] or params[:in_transc]=="1" # If looking for a string in the header categories and/or in the transcription with tags
          @pages = Page.order('work_id, position').joins(:work).where(["works.collection_id = ? AND source_text REGEXP ?", @collection.id, search_s]).paginate(page: params[:page])
         
        elsif !params[:header_cat] and params[:in_text]=="1" # If looking for a string only in the transcription without tags, not in the header categories
          @pages = Page.order('work_id, position').joins(:work).where(["works.collection_id = ? AND original_text REGEXP ?", @collection.id, search_s]).paginate(page: params[:page])
        
        else # If looking for a string in the header categories and in the transcription without tags
          @pages = Page.order('work_id, position').joins(:work).where(["works.collection_id = ? AND search_text REGEXP ?", @collection.id, search_s]).paginate(page: params[:page])
        
        end
      else # If there is no search string
        @pages = Page.order('work_id, position').joins(:work).where(["works.collection_id = ?", @collection.id]).paginate(page: params[:page])
      end

    end
    logger.debug "DEBUG #{@search_string}"
  end


end