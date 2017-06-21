class Attributecat < ActiveRecord::Base
  has_and_belongs_to_many :categoryattributes
  attr_accessible :name, :id

  validates :name, presence: true

end