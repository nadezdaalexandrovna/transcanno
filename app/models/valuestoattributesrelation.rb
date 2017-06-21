class Valuestoattributesrelation < ActiveRecord::Base
  belongs_to :attributevalue
  has_many :attributes_to_values
  attr_accessible :attributevalue_id, :consequent_attr_name, :id

  validates :attributevalue_id, presence: true
  validates :consequent_attr_name, presence: true
end
