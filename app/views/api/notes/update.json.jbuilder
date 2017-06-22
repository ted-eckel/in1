# json.extract! @note, :id, :title, :content, :color, :initial_created_at, :initial_updated_at, :state
json.partial! 'note', note: @note
