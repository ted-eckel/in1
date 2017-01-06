Rails.application.routes.draw do

  namespace :api, defaults: {format: :json} do
    resource :user, only: [:create]
    resource :session, only: [:create, :destroy, :show]
    match 'pocket_retrieve', to: 'pocket#retrieve', via: [:post]
  end

  match '/auth/:provider/callback', to: 'static_pages#root', via: [:get, :post]
  # match '/auth/:provider/callback', to: 'static_pages#omniauth_callback', via: [:get, :post]

  root "static_pages#root"
end
