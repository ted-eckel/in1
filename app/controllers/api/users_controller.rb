class Api::UsersController < ApplicationController

  # def create
  #   @user = User.new
  #
  #   if @user.save
  #     login(@user)
  #     redirect_to root_url
  #   else
  #     render json: @user.errors.full_messages, status: 422
  #   end
  # end

  def create
		# debugger
		@user = User.new(user_params)

		if @user.save
			login(@user)
			render "api/users/show"
		else
			render json: @user.errors.full_messages, status: 422
		end
  end

  def new
    redirect_to root_url
  end

  private

  def user_params
    params.require(:user).permit(:username, :password)
  end
end
