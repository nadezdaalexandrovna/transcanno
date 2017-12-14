Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  Rails.application.routes.default_url_options[:host] = '127.0.0.1'

  config.relative_url_root = "/transcanno"
  #config.root = '/transcanno' #My invention, didn't read it anywhere
  #config.action_controller.asset_host = '/transcanno'
  
  # Code is not reloaded between requests.
  config.cache_classes = true

  # Eager load code on boot. This eager loads most of Rails and
  # your application in memory, allowing both threaded web servers
  # and those relying on copy on write to perform better.
  # Rake tasks automatically ignore this option for performance.
  config.eager_load = true
  #config.enable_dependency_loading = true # Nadya added from https://github.com/drapergem/draper/issues/773, but didn't fix NameError (uninitialized constant DocumentUpload::RAKE):  app/models/document_upload.rb:21:in `submit_process'  app/helpers/add_work_helper.rb:39:in `new_upload'

  # Full error reports are disabled and caching is turned on.
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true

  # Enable Rack::Cache to put a simple HTTP cache in front of your application
  # Add `rack-cache` to your Gemfile before enabling this.
  # For large-scale production use, consider using a caching reverse proxy like nginx, varnish or squid.
  # config.action_dispatch.rack_cache = true

  # action mailer config -- required for password resets and the bulk uploader
    config.action_mailer.smtp_settings = {
    :address   => "outlook.office365.com",
    :port      => 587, # ports 587 and 2525 are also supported with STARTTLS
    :enable_starttls_auto => true, # detects and uses STARTTLS
    :user_name => "nokinina@eurac.edu",
    :password  => "",
    :authentication => 'login',
    :domain => 'office365.com', # your domain to identify your server when connecting
  }
  config.action_mailer.default_url_options =  { host: '10.8.83.147:3001' } #change this to match your server URL, i.e. www.fromthepage.com
  config.action_mailer.default_options
  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false
  
  # Disable Rails's static asset server (Apache or nginx will already do this).
  config.serve_static_assets = true

  # Compress JavaScripts and CSS.
  config.assets.js_compressor = :uglifier
  config.assets.css_compressor = :sass

  #config.public_file_server.enabled=true

  # Do not fallback to assets pipeline if a precompiled asset is missed.
  config.assets.compile = true
  config.assets.precompile =  ['*.js', '*.css', '*.css.erb']
  #config.assets.precompile += ['javascripts/*']
  #config.assets.precompile += ['plugins/*']

  # Generate digests for assets URLs.
  config.assets.digest = true

  # Version of your assets, change this if you want to expire all your assets.
  config.assets.version = '1.0'

  # Specifies the header that your server uses for sending files.
  # config.action_dispatch.x_sendfile_header = "X-Sendfile" # for apache
  # config.action_dispatch.x_sendfile_header = 'X-Accel-Redirect' # for nginx

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  # config.force_ssl = true

  # Set to :debug to see everything in the log.
  config.log_level = :debug

  # Prepend all log lines with the following tags.
  # config.log_tags = [ :subdomain, :uuid ]

  # Use a different logger for distributed setups.
  # config.logger = ActiveSupport::TaggedLogging.new(SyslogLogger.new)

  # Use a different cache store in production.
  # config.cache_store = :mem_cache_store

  # Enable serving of images, stylesheets, and JavaScripts from an asset server.
  # config.action_controller.asset_host = "http://assets.example.com"

  # Precompile additional assets.
  # application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
  # config.assets.precompile += %w( search.js )

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation cannot be found).
  config.i18n.fallbacks = true

  # Send deprecation notices to registered listeners.
  config.active_support.deprecation = :notify

  # Disable automatic flushing of the log to improve performance.
  # config.autoflush_log = false

  # Use default logging formatter so that PID and timestamp are not suppressed.
  config.log_formatter = ::Logger::Formatter.new

  # Do not dump schema after migrations.
  config.active_record.dump_schema_after_migration = false
  
    # http://pontiiif.brumfieldlabs.com/api/v0.0/search/Irish
  config.pontiiif_server = 'http://pontiiif.brumfieldlabs.com/'

  #config.enable_dependency_loading = true; I found it on a forum, but it didn't help.

  #RAKE = '/usr/bin/env rake'

end
