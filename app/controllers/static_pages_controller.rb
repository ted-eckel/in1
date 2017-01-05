# require 'httparty'

class StaticPagesController < ApplicationController
  def root
    @user = current_user
    # when the user signs in, check their identities, and if
    # there's no session data / cookie for that identity, then
    # reauthenticate user.identities
    if @user.identities
      @user.identities.each do |i|
        unless session["#{i.provider}_omniauth_data"]
          find_or_create_identity
          redirect_to "auth/#{i.provider}"
        end
      end
    end

    find_or_create_identity
  end
end
