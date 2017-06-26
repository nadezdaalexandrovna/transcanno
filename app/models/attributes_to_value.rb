class AttributesToValue < ActiveRecord::Base
  attr_accessible :categoryattribute_id, :attributevalue_id, :id, :valuestoattributesrelation_id
  validates :attributevalue_id, presence: true
  validates :categoryattribute_id, presence: true
  has_and_belongs_to_many :attributevalues
  belongs_to :categoryattribute
end