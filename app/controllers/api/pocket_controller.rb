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

  def modify
    url = "https://getpocket.com/v3/send?actions=%5B%7B%22action%22%3A%22#{params[:modify_action]}%22%2C%22time%22%3A#{params[:time]}%2C%22item_id%22%3A#{params[:item_id]}%7D%5D&access_token=#{session["pocket_omniauth_data"]["credentials"]["token"]}&consumer_key=#{ENV["pocket_consumer_key"]}"

    render json: HTTParty.post(
      url
    )
  end

  def add
    render json: HTTParty.post('https://getpocket.com/v3/add',
      {
        body: necessary_params.merge(pocket_add_params)
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

  # def pocket_send_params
  #   params.permit(
  #     :format,
  #     :item_id,
  #     :time
  #   ).transform_keys! do |key|
  #     key.to_sym
  #   end
  # end

  def pocket_add_params
    params.permit(
      :format,
      :url,
      :title,
      :tags,
      :tweet_id
    ).transform_keys! do |key|
      key.to_sym
    end
  end
end
