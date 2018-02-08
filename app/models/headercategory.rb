class Headercategory < ActiveRecord::Base
	belongs_to :category
 	attr_accessible :category_id, :is_header_category

end