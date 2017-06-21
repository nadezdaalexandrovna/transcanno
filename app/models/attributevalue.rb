class Attributevalue < ActiveRecord::Base
  attr_accessible :id, :value
  validates :value, presence: true
  validates_uniqueness_of :value
  has_and_belongs_to_many :attributes_to_values
  has_many :valuestoattributesrelations, :dependent => :delete_all
end