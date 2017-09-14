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
    sleep 0.3
    @driver.find_element(:id, "user_login_id").send_keys "collection_owner"
    @driver.find_element(:id, "user_password").send_keys "coll_coll"
    @driver.find_element(:name, "button").click

    sleep 0.3
    #assert(@driver.find_element(:class, "headline_title").text.include?("Owner Dashboard"),"Assertion Failed")

    #assert(@driver.find_element(:xpath, "//div[@class='toolbar_group']/dl/dt[@class='header_link header_user']/span/big").text.include?("Signed In As"),"Assertion Failed")

    assert(@driver.find_element(:xpath, "//small").text.include?("collection_owner"),"Assertion Failed")

    #@driver.find_element(:id, "logout").click
  end
end


#driver = Selenium::WebDriver.for :firefox

#driver.navigate.to "http://google.com"
#element = driver.find_element(:name, 'q')
#element.send_keys "TestProject.io"
#element.submit
 
#puts driver.title
 
#driver.quit
