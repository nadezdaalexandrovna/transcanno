#!/usr/bin/env ruby

require "selenium-webdriver"
require "test/unit"

class LoginClass < Test::Unit::TestCase
 
  def setup
    @driver = Selenium::WebDriver.for :firefox
    @driver.get('http://127.0.0.1:3000/')
    #@driver.manage.window.maximize
    #@driver.manage().window().setSize(new Dimension(1366, 768));   
  end
 
 
  def teardown
    @driver.quit
  end

=begin
 def test_login
    @driver.find_element(:link_text, "Sign In").click
    sleep 1
    @driver.find_element(:id, "user_login_id").send_keys "collection_owner"
    @driver.find_element(:id, "user_password").send_keys "coll_coll"
    @driver.find_element(:name, "button").click

    sleep 1

	assert(@driver.find_element(:tag_name,'body').text.include?("Signed In As"),"Assertion Failed")

	#Problem working with frames
	#@driver.find_element(:link_text, "Subjects").click
	#sleep 1
    #@driver.find_element(:xpath, "//*[text()='Actions']").click
    #sleep 1
    #@driver.find_element(:link_text, "Add Root Category").click
    #sleep 1

    #Problem working with frames
    #@driver.find_element(:xpath, "//*[text()='Actions']").click
    #sleep 1
    #@driver.find_element(:link_text, "Create a Collection").click
    #sleep 1

    #@driver.switch_to.frame @driver.find_element(:class,'litebox')
    
    #@driver.find_element(:class,'litebox')
    #@driver.find_element(:id, "collection_title")

    #@driver.find_element(:id, "collection_title").click
    #@driver.find_element(:id, "collection_title").clear
    #@driver.find_element(:id, "collection_title").send_keys "Selenium_collection"
    #@driver.find_element(:id, "collection_intro_block").send_keys "A collection for Selenium tests."
    #@driver.find_element(:xpath, "//*[text()='Create Collection'").click

  end
 
  def test_insert_tag_with_button_type_inside
    @driver.find_element(:link_text, "Sign In").click
    sleep 1
    @driver.find_element(:id, "user_login_id").send_keys "collection_owner"
    @driver.find_element(:id, "user_password").send_keys "coll_coll"
    @driver.find_element(:name, "button").click

    sleep 1

	@driver.find_element(:link_text, "Student essays").click
	sleep 1

	@driver.find_element(:link_text, "20170911132713504").click
	sleep 1
	@driver.find_element(:link_text, "1").click
	sleep 1
	@driver.find_element(:link_text, "Transcribe").click
	sleep 1
	#Type some text
	@driver.find_element(:id, "page_source_text").send_keys "some text to tag"
	sleep 1
	#Insert a tag with a button
	@driver.find_element(:xpath, "//span[text()='infinitive']").click
	sleep 1
	#Type inside the tag
	@driver.find_element(:tag_name, "infinitive_id6").send_keys "inside the infinitive tag"
	sleep 1
	#Verify that the text I've just typed is inside the inserted tag
	assert(@driver.find_element(:xpath,"//*[@class='medium-infinitive_id6']").text.include?("inside the infinitive tag"),"Assertion Failed")

  end
=end
=begin	
  def test_tag_with_hotkeys_type_inside
    @driver.find_element(:link_text, "Sign In").click
    sleep 1
    @driver.find_element(:id, "user_login_id").send_keys "collection_owner"
    @driver.find_element(:id, "user_password").send_keys "coll_coll"
    @driver.find_element(:name, "button").click

    sleep 1

	@driver.find_element(:link_text, "Student essays").click
	sleep 1

	@driver.find_element(:link_text, "20170911132713504").click
	sleep 1
	@driver.find_element(:link_text, "1").click
	sleep 1
	@driver.find_element(:link_text, "Transcribe").click
	sleep 1
	
	#puts Selenium::WebDriver::Keys::KEYS
	#Open the dropdown menu via hot keys
	@driver.find_element(:id, "page_source_text").send_keys [:alt, 'c']
	sleep 1
	#Type "inf" in the input field and click "enter" in order to choose the "infinitive" category
	@driver.find_element(:class, "chosen-search").send_keys 'inf'
	sleep 1
	@driver.find_element(:class, "chosen-search").send_keys :enter
	sleep 1
	#Type inside the tag
	@driver.find_element(:tag_name, "infinitive_id6").send_keys "inside the infinitive tag"
	sleep 1
	#Verify that the text I've just typed is inside the inserted tag
	assert(@driver.find_element(:xpath,"//*[@class='medium-infinitive_id6']").text.include?("inside the infinitive tag"),"Assertion Failed")

  end
=end
  def test_try_to_modify_tag_with_hotkeys
    @driver.find_element(:link_text, "Sign In").click
    sleep 1
    @driver.find_element(:id, "user_login_id").send_keys "collection_owner"
    @driver.find_element(:id, "user_password").send_keys "coll_coll"
    @driver.find_element(:name, "button").click

    sleep 1

	@driver.find_element(:link_text, "Student essays").click
	sleep 1

	@driver.find_element(:link_text, "20170911132713504").click
	sleep 1
	@driver.find_element(:link_text, "1").click
	sleep 1
	@driver.find_element(:link_text, "Transcribe").click
	sleep 1
	
	#puts Selenium::WebDriver::Keys::KEYS
	#Open the dropdown menu via hot keys
	@driver.find_element(:id, "page_source_text").send_keys [:alt, 'c']
	sleep 1
	#Type "inf" in the input field and click "enter" in order to choose the "infinitive" category
	@driver.find_element(:class, "chosen-search").send_keys 'inf'
	sleep 1
	@driver.find_element(:class, "chosen-search").send_keys :enter
	sleep 1
	#Type inside the tag
	@driver.find_element(:tag_name, "infinitive_id6").send_keys "inside the infinitive tag"
	sleep 1

	#Open the tag deletion menu via hotkeys
	@driver.find_element(:id, "page_source_text").send_keys [:alt, 'm']
	sleep 1
	#Choose the tag to delete
	@driver.find_element(:css, "#change_radio_INFINITIVE_ID6").click
	sleep 1
	#Confirm the choice
	@driver.find_element(:css, "#change_tag_confirm_button").click
	sleep 1
	#Verify the presence of an alert (because the infinitive tag can't be changed as it has no attributes)
	driver.switch_to.alert.accept rescue Selenium::WebDriver::Error::NoAlertOpenError

	
  end

=begin
  def test_delete_tag_with_hotkeys
    @driver.find_element(:link_text, "Sign In").click
    sleep 1
    @driver.find_element(:id, "user_login_id").send_keys "collection_owner"
    @driver.find_element(:id, "user_password").send_keys "coll_coll"
    @driver.find_element(:name, "button").click

    sleep 1

	@driver.find_element(:link_text, "Student essays").click
	sleep 1

	@driver.find_element(:link_text, "20170911132713504").click
	sleep 1
	@driver.find_element(:link_text, "1").click
	sleep 1
	@driver.find_element(:link_text, "Transcribe").click
	sleep 1
	
	#puts Selenium::WebDriver::Keys::KEYS
	#Open the dropdown menu via hot keys
	@driver.find_element(:id, "page_source_text").send_keys [:alt, 'c']
	sleep 1
	#Type "inf" in the input field and click "enter" in order to choose the "infinitive" category
	@driver.find_element(:class, "chosen-search").send_keys 'inf'
	sleep 1
	@driver.find_element(:class, "chosen-search").send_keys :enter
	sleep 1
	#Type inside the tag
	@driver.find_element(:tag_name, "infinitive_id6").send_keys "inside the infinitive tag"
	sleep 1

	#Open the tag deletion menu via hotkeys
	@driver.find_element(:id, "page_source_text").send_keys [:alt, 'n']
	sleep 1
	#Choose the tag to delete
	@driver.find_element(:css, "#delete_checkbox_INFINITIVE_ID6").click
	sleep 1
	#Confirm the choice
	@driver.find_element(:css, "#delete_tag_confirm_button").click
	sleep 1
	#Verify that the tag is absent from the page
	assert_equal(@driver.find_elements(:xpath,"//*[@class='medium-infinitive_id6']").size, 0)
	
  end


def test_delete_tag_with_button
    @driver.find_element(:link_text, "Sign In").click
    sleep 1
    @driver.find_element(:id, "user_login_id").send_keys "collection_owner"
    @driver.find_element(:id, "user_password").send_keys "coll_coll"
    @driver.find_element(:name, "button").click

    sleep 1

	@driver.find_element(:link_text, "Student essays").click
	sleep 1

	@driver.find_element(:link_text, "20170911132713504").click
	sleep 1
	@driver.find_element(:link_text, "1").click
	sleep 1
	@driver.find_element(:link_text, "Transcribe").click
	sleep 1
	#Type some text
	@driver.find_element(:id, "page_source_text").send_keys "some text to tag"
	sleep 1
	#Insert a tag with a button
	@driver.find_element(:xpath, "//span[text()='infinitive']").click
	sleep 1
	#Type inside the tag
	@driver.find_element(:tag_name, "infinitive_id6").send_keys "inside the infinitive tag"
	sleep 1

	@driver.find_element(:xpath, "//span[@class='delete_tag']").click
	sleep 1

	@driver.find_element(:css, "#delete_checkbox_INFINITIVE_ID6").click
	sleep 1
	
	@driver.find_element(:css, "#delete_tag_confirm_button").click
	sleep 1

	assert_equal(@driver.find_elements(:xpath,"//*[@class='medium-infinitive_id6']").size, 0)
	
  end
=end

end

