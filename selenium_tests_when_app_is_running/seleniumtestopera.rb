#!/usr/bin/env ruby

require "selenium-webdriver"
require "test/unit"

class LoginClass < Test::Unit::TestCase
 
  def setup

    operadriver_path = File.join(File.absolute_path('', File.dirname("/usr/local/share/")),"share","operadriver")
    puts operadriver_path
    Selenium::WebDriver::Opera.driver_path = operadriver_path
    @driver = Selenium::WebDriver.for :opera

    #@driver = Selenium::WebDriver.for :opera
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

  end
end

