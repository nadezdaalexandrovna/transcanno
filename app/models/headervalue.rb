class Headervalue < ActiveRecord::Base
	belongs_to :category
 	attr_accessible :category_id, :value, :is_default, :allow_user_input
 	validates :category_id, presence: true
 	validates :value, presence: true, uniqueness: { scope: :category_id }
end