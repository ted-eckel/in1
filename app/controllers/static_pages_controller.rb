# require 'httparty'

class StaticPagesController < ApplicationController
  def root
    find_or_create_identity
  end

  # def omniauth_callback
  #   find_or_create_identity
  #   redirect_to root_url
  # end
end
