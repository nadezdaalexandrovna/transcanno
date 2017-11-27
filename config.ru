# This file is used by Rack-based servers to start the application.

require ::File.expand_path('../config/environment',  __FILE__)
#run Fromthepage::Application

#map ENV["MYAPP_RELATIVE_URL_ROOT"] do
  #run Rails.application
  #run Fromthepage::Application                                                                                                                                                                                                                 
#end

map '/transcanno' do
  run Rails.application
  #run Fromthepage::Application                                                                                                                                                                                                                 
end

#map Rails::Application.config.relative_url_root || "/" do
  #run Rails.Application
  #run Fromthepage::Application
#end

