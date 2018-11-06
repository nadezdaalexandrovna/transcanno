class CreateHeadercategories < ActiveRecord::Migration
  def self.up
    create_table :headercategories do |t|
      # t.column :name, :string
      t.column :id, :integer
      t.column :category_id, :integer
      # automated stuff
      t.column :is_header_category, :boolean, :default => false
      t.column :allow_user_input, :boolean, :default => false
      t.column :only, :integer, :default => 0
      t.column :max_len, :integer, :default => 0
    end
  end

  def self.down
    drop_table :headercategories
  end
end
