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
 
  def test_tag_text_with_button
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
	@driver.find_element(:id, "page_source_text").send_keys "some text to tag"
	sleep 1
	@driver.find_element(:xpath, "//span[text()='infinitive']").click
	sleep 1
	@driver.find_element(:tag_name, "infinitive_id6").send_keys "inside the infinitive tag"
	sleep 1

	assert(@driver.find_element(:xpath,"//*[@class='medium-infinitive_id6']").text.include?("inside the infinitive tag"),"Assertion Failed")

  end
end

