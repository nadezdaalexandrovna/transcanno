require 'spec_helper'

#require 'simple_send_keys'

describe "category attributes", :order => :defined do
  #Capybara.javascript_driver = :webkit

  Capybara.javascript_driver = :selenium
  Capybara.register_driver :selenium do |app|
    Capybara::Selenium::Driver.new(app, :browser => :firefox)
  end
  
  Capybara.current_driver = Capybara.javascript_driver

  ActionController::Base.asset_host = "http://localhost:3000"
  
  before :all do
    @owner = User.find_by(login: OWNER)
    @user = User.find_by(login: USER)
    @collection_ids = Deed.where(user_id: @user.id).distinct.pluck(:collection_id)
    @collections = Collection.where(id: @collection_ids)
    @collection = @collections.first
    @category = @collection.categories.first
    @work = @collection.works.first
    sleep(10)
  end

  before :each do
    login_as(@user, :scope => :user)
  end
=begin  
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
=end

  it "from firefox", :js=>true do
    #@driver = Capybara.current_driver
    #@driver.find_element(:link_text, "Sign In").click
    sleep(10)
    test_page = @work.pages.second
    visit "/display/display_page?page_id=#{test_page.id}"
    page.find('.tabs').click_link("Transcribe")
    #find_element(:link_text, "Student essays").click
    sleep(10)
    #@driver.find_element(:id, "user_login_id").send_keys "collection_owner"
    #@driver.find_element(:id, "user_password").send_keys "coll_coll"
    #@driver.find_element(:name, "button").click

    sleep 1

    assert(@driver.find_element(:tag_name,'body').text.include?("Signed In As"),"Assertion Failed")
  end

=begin
  it "tag with a button", :js=>true do    
    test_page = @work.pages.second
    puts "in tag with a button test_page: "+test_page.inspect
    visit "/display/display_page?page_id=#{test_page.id}"
    puts "in tag with a button beginning page.body: "+page.body
    page.find('.tabs').click_link("Transcribe")
    puts "in tag with a button page.body: "+page.body
    #expect(page).to have_content("Transcription finished")

    #el = find(:xpath, "//div[@id='page_source_text']")
    #el.set("hello bright sun")
    #page.fill_in 'page_source_text', with: "hello bright sun"
    #find('div[contenteditable]').set("hello bright sun")

    find('#page_source_text').base.send_keys("hello bright sun")

    #find('#page_source_text').native.send_keys(:alt).send_keys("c")

    #find("#page_source_text").send_keys('[alt, c]')

    find("#page_source_text").native.send_keys[:alt, 'c']
    
    #keypress_script = "$('#page_source_text').val('some string').keydown();"
    #page.driver.browser.execute_script(keypress_script)

    #click_button('Save Changes')
    #click_button('Transcription finished')
    #expect(page).to have_content("Transcription")
    #puts "in type some text page.body: "+page.body
    #puts "in tag with a button after finished page.body: "+page.body
    #expect(page).to have_content(@category.title)

    #page.find(:xpath,"//span[text()='People']", match: :first).click

    expect(page).to have_selector('#popupBody', visible: true)

    if Capybara.javascript_driver == :selenium
      page.find(:xpath,"//div[@id='verticalMediumClickableSpansAdv']//span[text()='People']").click
      puts "page in tag clicked first"
    else
      page.find(:xpath,"//div[@id='verticalMediumClickableSpansAdv']//span[text()='People']").trigger("click")
      puts "page in tag clicked second"
      puts Capybara.javascript_driver.inspect
    end
    
    #page.fill_in 'page_source_text', with: "hello bright sun"
    #click_button('Save Changes')
    #click_button('Transcription finished')
    #expect(page).to have_content("Transcription")

    puts "page in tag: "+page.body

    #test_page = @work.pages.second

    #puts "test_page.source_text in tag: "+test_page.source_text

    #expect(test_page.source_text).to have_content(@category.title+'_id'+@category.id.to_s)
    
    #expect(page).to have_content(@category.title+'_id'+@category.id.to_s)
    #page.find(:xpath,"//"+@category.title+'_id'+@category.id, match: :first)
    
  end
=end
 end