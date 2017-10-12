Transc&Anno is an open source tool for transcription and on-the-fly annotation of handwritten documents.

In was developed on the basis of the FromThePage collaboration transcription tool: https://github.com/benwbrum/fromthepage

For configuration instructions refer to the FromThePage wiki: https://github.com/benwbrum/fromthepage/wiki/

For usage instructions refer to the user guide available on this page: fromthepage_user_guide.pdf


### Features

- Intuitive transcription and annotation environment. The annotator uses hot keys or buttons triggering pop-up menus in oder to annotate.
- Intuitive annotation scheme definition environment.
- Version Control: Changes to each page transcription are recorded and may be viewed to follow the edit history of a page.
- Presentation: Readers can view transcriptions in a multi-page format or alongside page images.

### License

Transc&Anno is open source.

### Platform

Transc&Anno currently requires Ruby on Rails version 4.1.1 and the RMagick, hpricot, will_paginate, and OAI gems.

### Installation

#### Docker installation

A docker installation is provided in the following repository: https://github.com/commul/transcanno-docker

#### Otherwise,

Install Ruby, RubyGems, Bundler, ImageMagick, MySQL and Git

Clone the repository

    git clone git://github.com/commul/fromthepage.git

Install required gems

    bundle install

Install Graphviz

    apt-get install graphviz (or see the graphviz documentation at http://www.graphviz.org/)

Configure MySQL

Create a database and user account for Transc&Anno to use.

Then update the config/database.yml file to point to the MySQL user account and database you created above.

Run
    rake db:migrate
to load the schema definition into the database account.

Modify the configuration parameters in config/initializers/01fromthepage.rb.

Modify the config/environments/production.rb (or development.rb) file to configure your mailer.  (Search for "action_mailer".)

Finally, start the application

    rails server

