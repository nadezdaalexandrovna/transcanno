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
			mode tinyint not null,
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
  end

  def self.down
    execute "DROP TABLE IF EXISTS attributes_to_values, valuestoattributesrelations, categoryscopes, attributevalues, categoryattributes, attributecats, categorystyles;"
  end
end
