class ChangeAttachmentsColumnName < ActiveRecord::Migration
  def change
    rename_column :notes, :attachments, :drive_attachment_ids
  end
end
