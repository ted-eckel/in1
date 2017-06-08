class Api::UsersController < ApplicationController

  def create
		@user = User.new(user_params)

		if @user.save
			login(@user)
			# render "api/users/show"
		else
			render json: @user.errors.full_messages, status: 422
		end
  end

  def show
    @user = User.find(params[:id])
  end

  def change_settings
    @user = current_user

    @user.settings = settings_params
    @user.save
    render json: @user.settings
  end

  private

  def user_params
    params.require(:user).permit(:username, :password)
  end

  def settings_params
    params.permit(:drive_uploads_folder_id)
  end
end
