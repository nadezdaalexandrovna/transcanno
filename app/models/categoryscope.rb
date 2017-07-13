class Categoryscope < ActiveRecord::Base
	belongs_to :category
 	attr_accessible :category_id, :mode

end