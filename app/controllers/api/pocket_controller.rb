require 'httparty'
# require 'json'

class Api::PocketController < ApplicationController

  def retrieve
    render json: HTTParty.post('https://getpocket.com/v3/get', pocket_get_params)
  end

  private

  def necessary_params
    {
      "consumer_key" => ENV["pocket_consumer_key"],
      "access_token" => session["pocket_omniauth_data"]["credentials"]["token"]
    }
  end

  def pocket_get_params
    {
      "body" => params.permit(
        :state,
        :favorite,
        :tag,
        :contentType,
        :sort,
        :detailType,
        :search,
        :domain,
        :since,
        :count,
        :offset
      ).merge(necessary_params)
    }
  end

  def pocket_send_params
    # TODO:
  end

  def pocket_add_params
    # TODO:
  end
end
