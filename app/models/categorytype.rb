class Categorytype < ActiveRecord::Base

  belongs_to :category
  attr_accessible :category_id, :type

  validates :type, presence: true

end
