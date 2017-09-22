require 'spec_helper'

describe "category attributes", :order => :defined do
  #Capybara.javascript_driver = :webkit
  #Capybara.current_driver = Capybara.javascript_driver

  Capybara.javascript_driver = :selenium
  Capybara.register_driver :selenium do |app|
    Capybara::Selenium::Driver.new(app, :browser => :firefox)
  end

  ActionController::Base.asset_host = "http://localhost:3000"
  
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
  
  it "type some text", :js=>true do
  	test_page = @work.pages.second
    visit "/display/display_page?page_id=#{test_page.id}"
    page.find('.tabs').click_link("Transcribe")
    puts "in type some text page.body: "+page.body
    #expect(page).to have_content("Transcription finished")

    #el = find(:xpath, "//div[@id='page_source_text']")
    #el.set("hello bright sun")
    #page.fill_in 'page_source_text', with: "hello bright sun"
    #find('div[contenteditable]').set("hello bright sun")

    find('#page_source_text').base.send_keys("hello bright sun")
    #click_button('Save Changes')
    click_button('Transcription finished')
    #expect(page).to have_content("Transcription")
    #puts "in type some text page.body: "+page.body
    puts "in type some text after finished page.body: "+page.body
    expect(page).to have_content("hello bright sun")
    
  end

  it "tag with a button", :js=>true do
    test_page = @work.pages.second
    visit "/display/display_page?page_id=#{test_page.id}"
    page.find('.tabs').click_link("Transcribe")

    #el = find(:xpath, "//div[@contenteditable='true' and @id='page_source_text']")
    #el.set("hello ")

    find('#page_source_text').base.send_keys("hello bright sun")

    #expect(page).to have_content(@category.title)

    #page.find(:xpath,"//span[text()='People']", match: :first).click

    if Capybara.javascript_driver == :selenium
      page.find(:xpath,"//div[@id='verticalMediumClickableSpansAdv']//span[text()='People']").click
      puts "page in tag clicked first"
    else
      page.find(:xpath,"//div[@id='verticalMediumClickableSpansAdv']//span[text()='People']").trigger("click")
      puts "page in tag clicked second"
    end
    
    #page.fill_in 'page_source_text', with: "hello bright sun"
    #click_button('Save Changes')
    click_button('Transcription finished')
    #expect(page).to have_content("Transcription")

    puts "page in tag: "+page.body

    test_page = @work.pages.second

    puts "test_page.source_text in tag: "+test_page.source_text

    expect(test_page.source_text).to have_content(@category.title+'_id'+@category.id.to_s)
    
    #expect(page).to have_content(@category.title+'_id'+@category.id.to_s)
    #page.find(:xpath,"//"+@category.title+'_id'+@category.id, match: :first)
    
  end

 end