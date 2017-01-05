class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  helper_method :current_user, :signed_in?

  def find_or_create_identity
    if request.env["omniauth.auth"]
      auth = request.env["omniauth.auth"]
      provider = auth["provider"]

      session["#{provider}_omniauth_data"] = auth

      @identity = Identity.find_with_omniauth(auth)

      if @identity.nil?
        @identity = Identity.create_with_omniauth(auth)
      end

      if @identity.user != current_user
        @identity.user = current_user
        @identity.save!
      end
    end
  end

  private

  def signed_in?
    !!current_user
  end

  def current_user
    return nil unless session[:session_token]
    @current_user ||= User.find_by(session_token: session[:session_token])
  end

  def login(user)
    user.reset_session_token!
    session[:session_token] = user.session_token
    @current_user = user
  end

  def logout
    current_user.reset_session_token!
    session[:session_token] = nil
    @current_user = nil
  end

  def require_logged_in
    render json: {base: ['invalid credentials']}, status: 401 if !current_user
  end
end
