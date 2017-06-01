class Attributevalue < ActiveRecord::Base

  belongs_to :categoryattribute
  attr_accessible :attribute_id, :value

  validates :value, presence: true

end