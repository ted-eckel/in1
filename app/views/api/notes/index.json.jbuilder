json.notes @notes.each do |note|
  json.partial! 'note', note: note
end

json.moreNotesStatus @notes.length < params[:count].to_i ? 2 : 1
