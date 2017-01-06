require 'httparty'
# require 'json'

class Api::PocketController < ApplicationController

  def retrieve
    render json: HTTParty.post('https://getpocket.com/v3/get',
      {
        body: necessary_params.merge(pocket_get_params)
      }
    )
  end


  private

  def necessary_params
    {
      consumer_key: ENV["pocket_consumer_key"],
      access_token: session["pocket_omniauth_data"]["credentials"]["token"]
    }
  end

  def pocket_get_params
    params.permit(
      :format,
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
    ).transform_keys! do |key|
      key.to_sym
    end
  end

  def pocket_send_params
    # TODO:
  end

  def pocket_add_params
    # TODO:
  end
end
