class Attributevaluestorelation < ActiveRecord::Base
  has_and_belongs_to_many :valuestoattributesrelations
  attr_accessible :attributevalue_id, :relation_id, :id

  validates :attributevalue_id, presence: true
  validates :relation_id, presence: true


end