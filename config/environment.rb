#Added for standalone version
=begin
module Rails
  class Configuration
    def database_configuration
      conf = YAML::load(ERB.new(IO.read(database_configuration_file)).result)
      if defined?(TAR2RUBYSCRIPT)
        conf.each do |k, v|
          if v["adapter"] =~ /^mysql/
            v["database"] = oldlocation(v["database"]) if v.include?("database")
            v["dbfile"]   = oldlocation(v["dbfile"])   if v.include?("dbfile")
          end
        end
      end
      conf
    end
  end
end
=end
#End of added for standalone version

# Load the Rails application.
require File.expand_path('../application', __FILE__)

#PATH_PREFIX = '/transcanno'
#config.action_controller.asset_host = PATH_PREFIX

Encoding.default_external = Encoding::UTF_8
Encoding.default_internal = Encoding::UTF_8

# Initialize the Rails application.
Rails.application.initialize!
