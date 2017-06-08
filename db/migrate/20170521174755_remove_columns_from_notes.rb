class RemoveColumnsFromNotes < ActiveRecord::Migration
  def change
    remove_column :notes, :initial_created_at, :datetime
    remove_column :notes, :initial_updated_at, :datetime
  end
end
