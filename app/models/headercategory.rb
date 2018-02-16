class Headercategory < ActiveRecord::Base
	belongs_to :category
 	attr_accessible :category_id, :is_header_category
 	validates :category_id, presence: true
end