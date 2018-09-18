class Headercategory < ActiveRecord::Base
	belongs_to :category
 	attr_accessible :category_id, :is_header_category, :allow_user_input, :only, :max_len
 	validates :category_id, presence: true
end