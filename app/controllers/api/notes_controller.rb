require 'activerecord-import'

class Api::NotesController < ApplicationController
  def create
    np = notes_params
    np[:notes].each_value do |note|
      unless note[:created_at].nil?
        note[:created_at] = DateTime.strptime(note[:created_at], '%Y-%m-%dT%H:%M:%S%z')
      end

      if note[:user_id].nil?
        note[:user_id] = current_user.id
      end
    end
    @notes = Note.create!(np[:notes].values)
    render :create
  end

  def destroy
    # @note = Note.find(params[:id])
    # id = @note.id
    # @note.destroy
    # render json: id
    dnp = delete_note_params
    @notes = Note.where(id: dnp[:note_ids])
    note_ids = @notes.ids
    @notes.destroy_all
    render json: note_ids
  end

  def index
    if params[:state] == 'archive'
      @notes = Note.where("user_id = ? AND state = ?", current_user.id, 'ARCHIVE').includes(:tags).order(created_at: :desc).limit(params[:count]).offset(params[:offset])
    elsif params[:state] == 'trash'
      @notes = Note.where("user_id = ? AND state = ?", current_user.id, 'TRASH').includes(:tags).order(created_at: :desc).limit(params[:count]).offset(params[:offset])
    else
      @notes = Note.where("user_id = ? AND state != ? AND state != ?", current_user.id, 'ARCHIVE', 'TRASH').includes(:tags).order(created_at: :desc).limit(params[:count]).offset(params[:offset])
    end

    # @notes = Note.where(user_id: current_user.id).includes(:tags).order(created_at: :desc).limit(params[:count]).offset(params[:offset])
    render :index
  end

  def show
  end

  def update
    @note = Note.find(params[:id])
    @note.update(note_params)
    render json: @note
    # mnp = modify_note_params
    # actions = {}
    # actions[:state] = mnp[:state]
    # actions[:color] = mnp[:color]
    # actions[:title] = mnp[:title]
    # actions[:drive_attachment_ids] = mnp[:drive_attachment_ids]
    # actions[:content] = mnp[:content]
    # actions[:all_tags] = mnp[:all_tags]
    # @note = Note.where(id: mnp[:note_ids])
    # @notes.update_all(actions)
    # render json: @notes
  end

  private

  def note_params
    params.require(:note).permit(
      :title,
      :content,
      :color,
      :all_tags,
      :created_at,
      :state,
      :drive_attachment_ids
    )
  end

  def notes_params
    params.permit(
      :format,
      {notes: [
        :user_id,
        :title,
        :content,
        :color,
        :created_at,
        :state,
        :drive_attachment_ids,
        :all_tags,
      ]}
    )
  end

  def delete_note_params
    params.permit(
      :format,
      note_ids: []
    )
  end

  def modify_note_params
    params.permit(
      :format,
      :state,
      :color,
      :title,
      :content,
      :drive_attachment_ids,
      :all_tags,
    )
  end
end
