require 'httparty'

class StaticPagesController < ApplicationController
  def root
  end

  def pocket
    options = {
        	body: {
        		consumer_key: ENV["pocket_consumer_key"],
        		access_token: session["pocket_access_token"],
        		count: 10,
            offset: 0,
            sort: 'newest',
            detailType: 'complete'
        	}
        }

    render json: HTTParty.post('https://getpocket.com/v3/get', options)
  end

  def auth_hash
    session["omniauth.pocket_data"] = request.env["omniauth.auth"]
    session["pocket_access_token"] = session["omniauth.pocket_data"]["credentials"]["token"]
    redirect_to pocket_url
  end
end
