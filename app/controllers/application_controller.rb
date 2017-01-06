class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception
  helper_method :current_user, :signed_in?

  def find_or_create_identity
    if signed_in?
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

      # check user's identities, and if there's no session data for that
      #identity, then reauthenticate each identity
      current_user.identities.find_each do |idnt|
        unless session["#{idnt.provider}_omniauth_data"]
          redirect_to "/auth/#{idnt.provider}" and return
        end
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
    find_or_create_identity
  end

  def logout
    current_user.identities.find_each do |idnt|
      if session["#{idnt.provider}_omniauth_data"]
        session["#{idnt.provider}_omniauth_data"] = nil
      end
    end
    current_user.reset_session_token!
    session[:session_token] = nil
    @current_user = nil
  end

  def require_logged_in
    render json: {base: ['invalid credentials']}, status: 401 if !current_user
  end
end
