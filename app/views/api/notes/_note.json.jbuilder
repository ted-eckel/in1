json.extract! note, :id, :title, :content, :color, :created_at, :updated_at, :state, :drive_attachment_ids

json.user do
  json.id note.user.id
  json.username note.user.username
end

json.tags note.tags
