require 'spec_helper'
require "selenium-webdriver"

xdescribe "Selenium Recipes - Start different browsers" do
	#Capybara::Selenium::Driver.browser = :firefox
  	#Capybara.current_driver = Capybara::Selenium::Driver
=begin
  	Capybara.register_driver :selenium do |app|
  		Capybara::Selenium::Driver.new(app, browser: :chrome)
	end

	Capybara.javascript_driver = :chrome

	Capybara.configure do |config|
  		config.default_max_wait_time = 10 # seconds
  		config.default_driver        = :selenium
	end
=end
=begin
	Capybara.register_driver :chrome do |app|
  		Capybara::Selenium::Driver.new(app, browser: :chrome)
	end

	Capybara.register_driver :headless_chrome do |app|
  		capabilities = Selenium::WebDriver::Remote::Capabilities.chrome(chromeOptions: { args: %w(headless disable-gpu) })

  		Capybara::Selenium::Driver.new app,
    		browser: :chrome,
    		desired_capabilities: capabilities
	end

	Capybara.javascript_driver = :headless_chrome
=end
	before(:all) do
		@driver = Capybara.javascript_driver
		#@driver = Selenium::WebDriver.for :firefox
	end

	before(:each) do
		#@driver.get('http://127.0.0.1:3000/')
	end

	after(:all) do
		#@driver.quit
	end

	it "Invalid Login", :js => true do

		#expect(page).to have_content("Sign In")

		#@driver.find_element(:link_text, "Sign In").click
		#driver.find_element(:link_text, "Sign In").click
		#page.find('a', text: "Sign In").click
		#print "page.body:\n"
		#puts page.body
		#print "end page.body\n"

		#puts "page.body:"+page.body

		click_link "Sign In"
		#page.find_element(:link_text, "Sign In").click
    	#sleep 1
    	@driver.find_element(:id, "user_login_id").send_keys "nobody"
    	@driver.find_element(:id, "user_password").send_keys "beee"
    	@driver.find_element(:name, "button").click
    	#sleep 1
		assert(@driver.find_element(:tag_name,'body').text.include?("Unable to sign in"),"Assertion Failed")
	end

	it "Login successfully", :js => true do
		@driver.find_element(:link_text, "Sign In").click
    	sleep 1
    	@driver.find_element(:id, "user_login_id").send_keys "collection_owner"
    	@driver.find_element(:id, "user_password").send_keys "coll_coll"
    	@driver.find_element(:name, "button").click
    	sleep 1
		assert(@driver.find_element(:tag_name,'body').text.include?("Signed In As"),"Assertion Failed")
	end

	it "go to Transcribe page, type a text and tag one word with a button successfully", :js => true do
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
