class Categorystyle < ActiveRecord::Base

  belongs_to :category
  attr_accessible :category_id, :colour, :textdecoration, :fontstyle

end