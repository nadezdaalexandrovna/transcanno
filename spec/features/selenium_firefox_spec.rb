require 'spec_helper'
require "selenium-webdriver"

describe "Selenium Recipes - Start different browsers" do

	before(:all) do
		@driver = Selenium::WebDriver.for :firefox
	end

	before(:each) do
		@driver.get('http://127.0.0.1:3000/')
	end

	after(:all) do
		@driver.quit
	end

	it "Invalid Login" do
		@driver.find_element(:link_text, "Sign In").click
    	sleep 1
    	@driver.find_element(:id, "user_login_id").send_keys "nobody"
    	@driver.find_element(:id, "user_password").send_keys "beee"
    	@driver.find_element(:name, "button").click
    	sleep 1
		assert(@driver.find_element(:tag_name,'body').text.include?("Unable to sign in"),"Assertion Failed")
	end

	it "Login successfully" do
		@driver.find_element(:link_text, "Sign In").click
    	sleep 1
    	@driver.find_element(:id, "user_login_id").send_keys "collection_owner"
    	@driver.find_element(:id, "user_password").send_keys "coll_coll"
    	@driver.find_element(:name, "button").click
    	sleep 1
		assert(@driver.find_element(:tag_name,'body').text.include?("Signed In As"),"Assertion Failed")
	end

	it "go to Transcribe page, type a text and tag one word with a button successfully" do
		@driver.find_element(:link_text, "Sign In").click
    	sleep 1
    	@driver.find_element(:id, "user_login_id").send_keys "collection_owner"
    	@driver.find_element(:id, "user_password").send_keys "coll_coll"
    	@driver.find_element(:name, "button").click

    	sleep 1

		assert(@driver.find_element(:tag_name,'body').text.include?("Signed In As"),"Assertion Failed")

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
		expect(@driver.find_element(:xpath, "//*[text()='inside the infinitive tag']")["class"]).to eq("medium-infinitive_id6")
	end
end
