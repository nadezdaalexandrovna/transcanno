class Categoryattribute < ActiveRecord::Base

  belongs_to :category
  has_many :attributevalues
  attr_accessible :category_id, :name, :let_free_values

  validates :name, presence: true

end