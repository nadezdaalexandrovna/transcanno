class CreateCategorystyles < ActiveRecord::Migration
  def self.up
    execute "create table categorystyles(
			id int not null AUTO_INCREMENT,
    		colour varchar (255),
    		textdecoration varchar (255),
    		fontstyle varchar (255),
    		category_id int not null,
    		primary key (id),
    		foreign key (category_id) references categories (id)
		);"

	execute "create table categorydescriptions(
			id int not null AUTO_INCREMENT,
			category_id int not null,
    		description text,
    		primary key (id),
    		foreign key (category_id) references categories (id)
		);"
	execute "create table attributecats(
			id int not null AUTO_INCREMENT,
			name varchar(255) unique not null,
			primary key (id)
		);"
	execute "create table categoryattributes (
			id int not null AUTO_INCREMENT,
			category_id int not null,
			primary key (id),
			foreign key(category_id) references categories(id),
			attributecat_id int not null,
			foreign key(attributecat_id) references attributecats(id),
			allow_user_input boolean,
			mode tinyint not null default 2,
			initial BOOLEAN NOT NULL default false
		);"
	execute "ALTER TABLE categoryattributes ADD CONSTRAINT UniqueAttrPercategory UNIQUE (category_id,attributecat_id);"

	execute "create table attributevalues (
			id int not null AUTO_INCREMENT,
			value varchar(255) unique not null,
			primary key (id)		
		);"
	execute	"create table categoryscopes(
			id int not null AUTO_INCREMENT,
			primary key (id),
			category_id int not null unique,
    		foreign key (category_id) references categories (id),
			mode tinyint not null default 2
		);"
	execute "create table valuestoattributesrelations(
			id int not null AUTO_INCREMENT,
			primary key (id),
			attributevalue_id int not null,
			consequent_attr_name varchar(255) not null,
			collection_id int not null,
			foreign key (collection_id) references collections (id)
		);"
	execute "create table attributes_to_values(
			id int not null AUTO_INCREMENT,
			primary key (id),
			categoryattribute_id int not null,
    		foreign key(categoryattribute_id) references categoryattributes(id),
    		attributevalue_id int not null,
    		foreign key (attributevalue_id) references attributevalues(id),
			valuestoattributesrelation_id int default null,
			foreign key(valuestoattributesrelation_id ) references valuestoattributesrelations(id)
		);"

	execute "INSERT INTO users (id, login, display_name, encrypted_password, password_salt, owner) values (2,'collection_owner','collection_owner', '8d68c043d13ad3c5f6cc386ac66143e1b7525c2e','pH5DjMrJB_F7frxyWKM-', 1);"
	execute "INSERT INTO collections (id, title, owner_user_id) values (1, 'Example collection',2);"
	execute "INSERT INTO categories (id, title, collection_id) values (1, 'infinitive', 1),(2, 'adv2', 1);"
	execute "INSERT INTO attributecats (id, name) values (1, 'a1'),(2,'a2');"
	execute "INSERT INTO categoryattributes (id, category_id, attributecat_id, allow_user_input, mode,initial) values (1,2,1,0,2,1),(2,2,2,1,2,1);"
	execute "INSERT INTO attributevalues (id, value) values (1,'v1'), (2, 'v2');"
	execute "INSERT INTO attributes_to_values (id, categoryattribute_id, attributevalue_id) values (1,1,1), (2, 1, 2);"

	execute "INSERT INTO collection_owners (user_id, collection_id) values (2,1);"
	execute "INSERT INTO works (id, title, owner_user_id, collection_id) values (1, 'first_work', 2, 1);"
	execute "INSERT INTO work_statistics (id, work_id, transcribed_pages, annotated_pages,total_pages,blank_pages,incomplete_pages) values (1, 1, 0, 0,2,0,0);"
	execute "INSERT INTO pages (id, title, work_id,base_image,base_width,base_height,position,lock_version) values (1, '1', 1,'public/images/uploaded/for_tests/page_0001.jpg',1649,2860,1,0);"
	execute "INSERT INTO document_uploads (id, user_id, collection_id,file,status) values (1, 2, 1,'MS_844.ZIP','finished');"
	execute "INSERT INTO categorystyles (colour, category_id) values ('#0901F3',1), ('#FF0000',2);"
	execute "INSERT INTO categoryscopes (id, category_id, mode) values (1,1,2);"

  end

  def self.down
    execute "DROP TABLE IF EXISTS attributes_to_values, valuestoattributesrelations, categoryscopes, attributevalues, categoryattributes, attributecats, categorystyles;"
  end
end
