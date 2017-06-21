class Categoryattribute < ActiveRecord::Base

  belongs_to :category
  has_many :attributevalues, :through => :attributes_to_values
  has_many :attributes_to_values, :dependent => :delete_all
  has_and_belongs_to_many :attributecats
  attr_accessible :category_id, :attributecat_id, :allow_user_input, :mode, :initial

  validates :attributecat_id, presence: true
  validates :category_id, presence: true
end