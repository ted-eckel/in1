class Api::NotesController < ApplicationController
  def create
    @note = Note.new(note_params)
    @note.user_id = params[:user_id]
    @note.save!
  end

  def destroy
    @note = Note.find(params[:id])
    id = @note.id
    @note.destroy
    render json: id
  end

  def index
    @notes = current_user.notes
    render json: @notes
  end

  def show
  end

  def update
    @note = Note.find(params[:note][:id])
    @note.update(note_params)
    render json: @note
  end

  private

  def note_params
    params.require(:note).permit(
      :title,
      :content,
      :color,
      :initial_created_at,
      :initial_updated_at,
      :state
    )
  end
end
