json.extract! note, :id, :title, :content, :color, :initial_created_at, :initial_updated_at, :state

json.user do
  json.id note.user.id
  json.username note.user.username
end
