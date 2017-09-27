require 'spec_helper'

describe "category attributes", :order => :defined do
	Capybara.javascript_driver = :webkit
	Capybara.current_driver = Capybara.javascript_driver

  before :all do
    @owner = User.find_by(login: OWNER)
    @collections = @owner.all_owner_collections
    @collection = @collections.first
    @category = @collection.categories.first
    @work = @collection.works.first
  end

  before :each do
    login_as(@owner, :scope => :user)
  end

  it "creates a new category attribute" do
  	@count = @category.categoryattributes.count
  	@name = "#category-" + "#{@category.id}"

  	#debugger

  	puts "@name: #{@name}"
  	puts "@count: #{@count}"
  	puts "@collection.title: #{@collection.title}"
  	puts "@category.title: #{@category.title}"

  	visit "/article/list?collection_id=#{@collection.id}#category-#{@category.id}"    
    page.find(@name).find('a', text: 'Define Category Attributes').click
    fill_in 'attribute[]', with: 'first_attribute'
    click_button('Define Attributes')
    expect(@count + 1).to eq (@category.categoryattributes.count)

    visit "/article/list?collection_id=#{@collection.id}#category-#{@category.id}"
    page.find(@name).find('a', text: 'Define Category Attributes').click
    expect(page).to have_content("first_attribute")
  end

  it "creates a new attribute value" do
  	@count = @category.categoryattributes.count
  	@name = "#category-" + "#{@category.id}"
  	first_attribute=@category.categoryattributes.first
  	first_attribute_name=first_attribute.attributecat.name
  	first_attribute_id=first_attribute.id

  	visit "/article/list?collection_id=#{@collection.id}#category-#{@category.id}"    
    page.find(@name).find('a', text: 'Define Category Attribute Values').click
    click_button(first_attribute_name)

    print "\npage.body:\n"
    puts page.body
    print "\n"
    #fill_in "add_attribute_value[#{first_attribute_id}][]", with: 'first_value'
    #fill_in "attribute_value_input_field", with: 'first_value'
    #el=find(:xpath, "//input[@class='attribute_value_input_field'")
    fill_in (:xpath, "//input[@class='attribute_value_input_field'"), with: 'first_value'
    click_button("Apply all changes")

    visit "/article/list?collection_id=#{@collection.id}#category-#{@category.id}"    
    page.find(@name).find('a', text: 'Define Category Attribute Values').click
    click_button(first_attribute_name)
    expect(page).to have_content("first_value")
    expect(@category.categoryattributes.first.attributecat.name).to eq ("first_value")

  end

  it "set category scope" do
  	@name = "#category-" + "#{@category.id}"
  	visit "/article/list?collection_id=#{@collection.id}#category-#{@category.id}"    
    page.find(@name).find('a', text: 'Assign Category Scope').click
    find(:css, "#category_category_scope_2").set(true)
    click_button('Assign Category Scope')
    expect(@category.categoryscope.mode).to eq (2)
  end

  it "set category style" do
  	@name = "#category-" + "#{@category.id}"
  	visit "/article/list?collection_id=#{@collection.id}#category-#{@category.id}"    
    page.find(@name).find('a', text: 'Define Category Style').click

    find(:css, "#2").set(true)
    find(:css, "#112").set(true)
    find(:css, "#201").set(true)

    click_button('Define Style')

    categorystyle=@category.categorystyle
    expect(categorystyle.colour).to eq ('#8e00ad')
    expect(categorystyle.textdecoration).to eq ('text-decoration: underline;')
    expect(categorystyle.fontstyle).to eq ('font-style: italic;')
  end

  it "apply all category changes" do
  	@name = "#category-" + "#{@category.id}"
  	visit "/article/list?collection_id=#{@collection.id}#category-#{@category.id}"    
    page.find(@name).find('a', text: 'Apply All Categories Changes').click

    test_page = @work.pages.second
    visit "/display/display_page?page_id=#{test_page.id}"
    page.find('.tabs').click_link("Transcribe")
    page.find('span', text: @category.title, match: :first)
  end

 end