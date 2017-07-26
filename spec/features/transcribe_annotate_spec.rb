require 'spec_helper'

describe "category attributes", :order => :defined do
  Capybara.javascript_driver = :webkit
  Capybara.current_driver = Capybara.javascript_driver
  
  before :all do
    @owner = User.find_by(login: OWNER)
    @user = User.find_by(login: USER)
    @collection_ids = Deed.where(user_id: @user.id).distinct.pluck(:collection_id)
    @collections = Collection.where(id: @collection_ids)
    @collection = @collections.first
    @category = @collection.categories.first
    @work = @collection.works.first
  end

  before :each do
    login_as(@user, :scope => :user)
  end
  
  it "type some text" do
  	test_page = @work.pages.second
    visit "/display/display_page?page_id=#{test_page.id}"
    page.find('.tabs').click_link("Transcribe")

    el = find(:xpath, "//div[@contenteditable='true' and @id='page_source_text']")
    el.set("hello bright sun")
    #page.fill_in 'page_source_text', with: "hello bright sun"
    click_button('Save Changes')
    expect(page).to have_content("Transcription")
    expect(page).to have_content("hello bright sun")
  end

  it "tag with a button" do
    test_page = @work.pages.second
    visit "/display/display_page?page_id=#{test_page.id}"
    page.find('.tabs').click_link("Transcribe")

    el = find(:xpath, "//div[@contenteditable='true' and @id='page_source_text']")
    el.set("hello ")

    expect(page).to have_content(@category.title)

    page.find(:xpath,"//span[text()='People']", match: :first).click
    
    #page.fill_in 'page_source_text', with: "hello bright sun"
    click_button('Save Changes')
    expect(page).to have_content("Transcription")

    puts "page in tag: "+page.body

    expect(page).to have_content(@category.title+'_id'+@category.id)
    #page.find(:xpath,"//"+@category.title+'_id'+@category.id, match: :first)
    
  end

 end