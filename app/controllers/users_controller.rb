class UsersController < ApplicationController
  def create
    @user = User.new

    if @user.save
      login(@user)
      redirect_to root_url
    else
      render json: @user.errors.full_messages, status: 422
    end
  end

  def new
    redirect_to root_url
  end
end
