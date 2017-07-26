class Categorydescription < ActiveRecord::Base
	belongs_to :category
 	attr_accessible :category_id, :description, :id

end