Transc&Anno is an open source tool for transcription and on-the-fly annotation of handwritten documents.

In was developed on the basis of the FromThePage collaboration transcription tool: https://github.com/benwbrum/fromthepage

For configuration instructions refer to the FromThePage wiki: https://github.com/benwbrum/fromthepage/wiki/

For usage instructions refer to the user guide available on this page: transcanno_user_guide.pdf


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

A docker installation is provided in the following repository: https://gitlab.inf.unibz.it/commul/docker/transcanno/

#### Otherwise,

Install Ruby, RubyGems, Bundler, ImageMagick, MySQL and Git

Clone the repository

    git clone https://github.com/commul/transcanno.git

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


### Branches

VersionUsedSummer2018 is the version of Transc&Anno used to transcribe the SMS collection.

The development branch contains the latest version of Transc&Anno where I tried to take into account most of the wishes I received from the 
users of VersionUsedSummer2018. In this version the database was modified. It means that a collection transcribed with the VersionUsedSummer2018 cannot be directly uploaded into this new version.

```
@ARTICLE{okininanicolastranscanno,
       author = {{Okinina}, N., {Nicolas}, L. and {Lyding}, V.},
        title = "{Transc&Anno: A Graphical Tool for the Transcription and On-the-Fly Annotation of Handwritten Documents}",
      volume = {Proceedings of the Eleventh International Conference on Language Resources and Evaluation (LREC 2018)},
     keywords = {transcription tools - annotation tools - learner corpora},
         year = 2018,
        month = May,
       adsurl = {https://www.aclweb.org/anthology/L18-1112}
}
```