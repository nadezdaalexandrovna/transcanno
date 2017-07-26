# Use this file to set/override Jasmine configuration options
# You can remove it if you don't need it.
# This file is loaded *after* jasmine.yml is interpreted.
#
# Example: using a different boot file.
# Jasmine.configure do |config|
#    config.boot_dir = '/absolute/path/to/boot_dir'
#    config.boot_files = lambda { ['/absolute/path/to/boot_dir/file.js'] }
# end
#
# Example: prevent PhantomJS auto install, uses PhantomJS already on your path.
Jasmine.configure do |config|
  if ENV['TRAVIS']
    config.prevent_phantom_js_auto_install = true
  end

  config.random = false
  config.show_console_log = false
  config.stop_spec_on_expectation_failure: false

  config.show_full_stack_trace = false
  config.prevent_phantom_js_auto_install = false
  config.server_port = 8888
  #config.ci_port = 3000
end
