#!/usr/bin/env ruby

require "selenium-webdriver"
require "test/unit"
require 'yaml'

class LoginClass < Test::Unit::TestCase
 
  def setup
    script_dir=File.expand_path(File.dirname(__FILE__))

    config = YAML.load_file(script_dir+'/config.yaml')
  	url=config['url']

	Selenium::WebDriver::Chrome.driver_path=script_dir+"/chromedriver_2.32_latest"
	@driver = Selenium::WebDriver.for :chrome
	@driver.get(url)   
  end
 
 
  def teardown
    @driver.quit
  end


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
  	#Log in
    @driver.find_element(:link_text, "Sign In").click
    sleep 1
    @driver.find_element(:id, "user_login_id").send_keys "collection_owner"
    @driver.find_element(:id, "user_password").send_keys "coll_coll"
    @driver.find_element(:name, "button").click
    sleep 1

    #Go to the collection
	@driver.find_element(:link_text, "Example collection").click
	sleep 1
	#Go to the work
	@driver.find_element(:link_text, "first_work").click
	sleep 1
	#Go to the page
	@driver.find_element(:link_text, "1").click
	sleep 1
	#Go to the transcription page
	@driver.find_element(:link_text, "Transcribe").click
	sleep 1
	#Type some text
	@driver.find_element(:id, "page_source_text").send_keys "some text to tag"
	sleep 1
	#Insert a tag with a button
	@driver.find_element(:xpath, "//span[text()='infinitive']").click
	sleep 1
	#Type inside the tag
	@driver.find_element(:tag_name, "infinitive_id1").send_keys "inside the infinitive tag"
	sleep 1
	#Verify that the text I've just typed is inside the inserted tag
	assert(@driver.find_element(:xpath,"//*[@class='medium-infinitive_id1']").text.include?("inside the infinitive tag"),"Assertion Failed")

  end

def test_get_out_of_tag_hotkeys
	#Log in
    @driver.find_element(:link_text, "Sign In").click
    sleep 1
    @driver.find_element(:id, "user_login_id").send_keys "collection_owner"
    @driver.find_element(:id, "user_password").send_keys "coll_coll"
    @driver.find_element(:name, "button").click
    sleep 1
    #Go to the collection
	@driver.find_element(:link_text, "Example collection").click
	sleep 1
	#Go to the work
	@driver.find_element(:link_text, "first_work").click
	sleep 1
	#Go to the page
	@driver.find_element(:link_text, "1").click
	sleep 1
	#Go to the transcription page
	@driver.find_element(:link_text, "Transcribe").click
	sleep 1
	#Type some text
	@driver.find_element(:id, "page_source_text").send_keys "some text to tag"
	sleep 1
	#Insert a tag with a button
	@driver.find_element(:xpath, "//span[text()='infinitive']").click
	sleep 1
	#Type inside the tag
	@driver.find_element(:tag_name, "infinitive_id1").send_keys "inside the infinitive tag"
	sleep 1

	#Get out of the tag
	@driver.find_element(:id, "page_source_text").send_keys [:alt, 'x']
	sleep 1

	#Type some text
	@driver.find_element(:id, "page_source_text").send_keys "text out of tag"
	sleep 1
	#Verify that the text I've just typed is outside the inserted tag
	assert_false(@driver.find_element(:xpath,"//*[@class='medium-infinitive_id1']").text.include?("text out of tag"),"Assertion Failed")

  end


  def test_change_hotkeys
  	#Log in
    @driver.find_element(:link_text, "Sign In").click
    sleep 1
    @driver.find_element(:id, "user_login_id").send_keys "collection_owner"
    @driver.find_element(:id, "user_password").send_keys "coll_coll"
    @driver.find_element(:name, "button").click
    sleep 1
    #Go to the collection
	@driver.find_element(:link_text, "Example collection").click
	sleep 1
	#Go to the work
	@driver.find_element(:link_text, "first_work").click
	sleep 1
	#Go to the page
	@driver.find_element(:link_text, "1").click
	sleep 1
	#Go to the transcription page
	@driver.find_element(:link_text, "Transcribe").click
	sleep 1
	
	#Open the hot keys modification menu
	@driver.find_element(:class, "show_change_hotkeys").click
	sleep 1
	#Change the insert_tag hot key
	#First empty the corresponding input field
	@driver.find_element(:id, "input_insert_tag").clear
	sleep 1
	#Then type the new value
	@driver.find_element(:id, "input_insert_tag").send_keys 'z'
	sleep 1
	#Apply the change
	@driver.find_element(:id, "changeHotKeys").click
	sleep 1
	#Reload the page
	@driver.navigate.refresh
	sleep 1

	#Try to insert a tag using the new hot key
	@driver.find_element(:id, "page_source_text").send_keys [:alt, 'z']
	sleep 1
	#Type "inf" in the input field and click "enter" in order to choose the "infinitive" category
	@driver.find_element(:class, "chosen-search").send_keys 'inf'
	sleep 1
	@driver.find_element(:class, "chosen-search").send_keys :enter
	sleep 1
	#Type inside the tag
	@driver.find_element(:tag_name, "infinitive_id1").send_keys "inside the infinitive tag"
	sleep 1
	#Verify that the text I've just typed is inside the inserted tag
	assert(@driver.find_element(:xpath,"//*[@class='medium-infinitive_id1']").text.include?("inside the infinitive tag"),"Assertion Failed")

  end

	
  def test_tag_no_attributes_with_hotkeys_type_inside
  	#Log in
    @driver.find_element(:link_text, "Sign In").click
    sleep 1
    @driver.find_element(:id, "user_login_id").send_keys "collection_owner"
    @driver.find_element(:id, "user_password").send_keys "coll_coll"
    @driver.find_element(:name, "button").click
    sleep 1
    #Go to the collection
	@driver.find_element(:link_text, "Example collection").click
	sleep 1
	#Go to the work
	@driver.find_element(:link_text, "first_work").click
	sleep 1
	#Go to the page
	@driver.find_element(:link_text, "1").click
	sleep 1
	#Go to the transcription page
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
	@driver.find_element(:tag_name, "infinitive_id1").send_keys "inside the infinitive tag"
	sleep 1
	#Verify that the text I've just typed is inside the inserted tag
	assert(@driver.find_element(:xpath,"//*[@class='medium-infinitive_id1']").text.include?("inside the infinitive tag"),"Assertion Failed")

  end

  def test_tag_in_advanced_mode_with_button_type_inside
  	#Log in
    @driver.find_element(:link_text, "Sign In").click
    sleep 1
    @driver.find_element(:id, "user_login_id").send_keys "collection_owner"
    @driver.find_element(:id, "user_password").send_keys "coll_coll"
    @driver.find_element(:name, "button").click
    sleep 1
    #Go to the collection
	@driver.find_element(:link_text, "Example collection").click
	sleep 1
	#Go to the work
	@driver.find_element(:link_text, "first_work").click
	sleep 1
	#Go to the page
	@driver.find_element(:link_text, "1").click
	sleep 1
	#Go to the transcription page
	@driver.find_element(:link_text, "Transcribe").click
	sleep 1

	#Switch to the advanced mode
	@driver.find_element(:id, "use_advanced_mode").click
	sleep 1

	#Open the dropdown menu via hot keys
	@driver.find_element(:id, "page_source_text").send_keys ''
	@driver.find_element(:class, "button-adv2_id2").click
	sleep 1
	#Type the value of the attribute demanding user input
	@driver.find_element(:id, "select-type-input").send_keys 'v1'
	sleep 1
	@driver.find_element(:id, "select-type-input").send_keys :enter
	sleep 1
	#Type the value of the second attribute demanding user input
	@driver.find_element(:id, "user-type-input").send_keys 'typed value of a2'
	sleep 1
	@driver.find_element(:id, "user-type-input").send_keys :enter
	sleep 1

	#Type inside the tag
	@driver.find_element(:tag_name, "adv2_id2").send_keys "inside the adv2 tag"
	sleep 1
	#Verify that the text I've just typed is inside the inserted tag
	assert(@driver.find_element(:xpath,"//*[@class='medium-adv2_id2']").text.include?("inside the adv2 tag"),"Assertion Failed")
	#Verify that there is one tag with the value of attribute 'a1' being 'v1'
	assert_equal(@driver.find_elements(:xpath,"//*[@a1='v1']").size, 1)
	#Verify that there is one tag with the value of attribute 'a2' being 'typed value of a2'
	assert_equal(@driver.find_elements(:xpath,"//*[@a2='typed value of a2']").size, 1)

  end



  def test_try_to_modify_tag_without_attributes_with_hotkeys
  	#Log in
    @driver.find_element(:link_text, "Sign In").click
    sleep 1
    @driver.find_element(:id, "user_login_id").send_keys "collection_owner"
    @driver.find_element(:id, "user_password").send_keys "coll_coll"
    @driver.find_element(:name, "button").click
    sleep 1
    #Go to the collection
	@driver.find_element(:link_text, "Example collection").click
	sleep 1
	#Go to the work
	@driver.find_element(:link_text, "first_work").click
	sleep 1
	#Go to the page
	@driver.find_element(:link_text, "1").click
	sleep 1
	#Go to the transcription page
	@driver.find_element(:link_text, "Transcribe").click
	sleep 1
	
	#Open the dropdown menu via hot keys
	@driver.find_element(:id, "page_source_text").send_keys [:alt, 'c']
	sleep 1
	#Type "inf" in the input field and click "enter" in order to choose the "infinitive" category
	@driver.find_element(:class, "chosen-search").send_keys 'inf'
	sleep 1
	@driver.find_element(:class, "chosen-search").send_keys :enter
	sleep 1
	#Type inside the tag
	@driver.find_element(:tag_name, "infinitive_id1").send_keys "inside the infinitive tag"
	sleep 1

	#Open the tag deletion menu via hotkeys
	@driver.find_element(:id, "page_source_text").send_keys [:alt, 'm']
	sleep 1
	#Choose the tag to delete
	@driver.find_element(:css, "#change_radio_INFINITIVE_id1").click
	sleep 1
	#Confirm the choice
	@driver.find_element(:css, "#change_tag_confirm_button").click
	sleep 1
	#Verify the presence of an alert (because the infinitive tag can't be changed as it has no attributes)
	driver.switch_to.alert.accept rescue Selenium::WebDriver::Error::NoAlertOpenError

	
  end


  def test_delete_tag_with_hotkeys
    #Log in
    @driver.find_element(:link_text, "Sign In").click
    sleep 1
    @driver.find_element(:id, "user_login_id").send_keys "collection_owner"
    @driver.find_element(:id, "user_password").send_keys "coll_coll"
    @driver.find_element(:name, "button").click
    sleep 1
    #Go to the collection
	@driver.find_element(:link_text, "Example collection").click
	sleep 1
	#Go to the work
	@driver.find_element(:link_text, "first_work").click
	sleep 1
	#Go to the page
	@driver.find_element(:link_text, "1").click
	sleep 1
	#Go to the transcription page
	@driver.find_element(:link_text, "Transcribe").click
	sleep 1
	
	#Open the dropdown menu via hot keys
	@driver.find_element(:id, "page_source_text").send_keys [:alt, 'c']
	sleep 1
	#Type "inf" in the input field and click "enter" in order to choose the "infinitive" category
	@driver.find_element(:class, "chosen-search").send_keys 'inf'
	sleep 1
	@driver.find_element(:class, "chosen-search").send_keys :enter
	sleep 1
	#Type inside the tag
	@driver.find_element(:tag_name, "infinitive_id1").send_keys "inside the infinitive tag"
	sleep 1

	#Open the tag deletion menu via hotkeys
	@driver.find_element(:id, "page_source_text").send_keys [:alt, 'n']
	sleep 1
	#Choose the tag to delete
	@driver.find_element(:css, "#delete_checkbox_INFINITIVE_id1").click
	sleep 1
	#Confirm the choice
	@driver.find_element(:css, "#delete_tag_confirm_button").click
	sleep 1
	#Verify that the tag is absent from the page
	assert_equal(@driver.find_elements(:xpath,"//*[@class='medium-infinitive_id1']").size, 0)
	
  end


def test_delete_tag_with_button
    #Log in
    @driver.find_element(:link_text, "Sign In").click
    sleep 1
    @driver.find_element(:id, "user_login_id").send_keys "collection_owner"
    @driver.find_element(:id, "user_password").send_keys "coll_coll"
    @driver.find_element(:name, "button").click
    sleep 1
    #Go to the collection
	@driver.find_element(:link_text, "Example collection").click
	sleep 1
	#Go to the work
	@driver.find_element(:link_text, "first_work").click
	sleep 1
	#Go to the page
	@driver.find_element(:link_text, "1").click
	sleep 1
	#Go to the transcription page
	@driver.find_element(:link_text, "Transcribe").click
	sleep 1

	#Type some text
	@driver.find_element(:id, "page_source_text").send_keys "some text to tag"
	sleep 1
	#Insert a tag with a button
	@driver.find_element(:xpath, "//span[text()='infinitive']").click
	sleep 1
	#Type inside the tag
	@driver.find_element(:tag_name, "infinitive_id1").send_keys "inside the infinitive tag"
	sleep 1
	#Push the "delete tag" button
	@driver.find_element(:xpath, "//span[@class='delete_tag']").click
	sleep 1
	#Choose the tag to delete
	@driver.find_element(:css, "#delete_checkbox_INFINITIVE_id1").click
	sleep 1
	#Confirm the deletion
	@driver.find_element(:css, "#delete_tag_confirm_button").click
	sleep 1
	#Verify that the tag is absent from the page
	assert_equal(@driver.find_elements(:xpath,"//*[@class='medium-infinitive_id1']").size, 0)
	
  end


end

