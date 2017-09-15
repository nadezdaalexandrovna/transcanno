require 'spec_helper'
require "selenium-webdriver"

describe "Selenium Recipes - Start different browsers" do

	before(:all) do
		@driver = Selenium::WebDriver.for(:chrome)
	end

	before(:each) do
		@driver.navigate.to("http://travel.agileway.net")
	end

	after(:all) do
		@driver.quit
	end

	it "Invalid Login" do
		@driver.find_element(:id, "username").send_keys("agileway")
		@driver.find_element(:id, "password").send_keys("changeme")
		@driver.find_element(:xpath,"//input[@value='Sign in']").click
		expect(@driver.page_source).to include("Invalid email or password")
	end

	it "Login successfully" do
		@driver.find_element(:id, "username").send_keys("agileway")
		@driver.find_element(:id, "password").send_keys("testwise")
		@driver.find_element(:xpath,"//input[@value='Sign in']").click
		expect(@driver.page_source).to include("Signed in!")
	end
end