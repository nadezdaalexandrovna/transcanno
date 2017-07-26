class Attributecat < ActiveRecord::Base
  has_many :categoryattributes
  attr_accessible :name, :id

  validates :name, presence: true

end