class AddAttachmentsToNotes < ActiveRecord::Migration
  def change
    add_column :notes, :attachments, :string
  end
end
