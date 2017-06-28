Rails.application.routes.draw do

  namespace :api, defaults: {format: :json} do
    resource :user, only: [:create, :show, :update]
    resource :session, only: [:create, :destroy, :show]
    resources :notes, only: [:create, :destroy, :index, :show, :update]
    match 'pocket_retrieve', to: 'pocket#retrieve', via: [:get, :post]
    match 'pocket_modify', to:   'pocket#modify', via: [:get, :post]
    match 'pocket_add', to: 'pocket#add', via: [:get, :post]
    match 'pocket_tags', to: 'pocket#tags', via: [:get, :post]
    match 'change_settings', to: 'users#change_settings', via: [:patch]
  end

  # match '/auth/:provider/callback', to: 'static_pages#root', via: [:get, :post]
  match '/auth/:provider/callback', to: 'static_pages#omniauth_callback', via: [:get, :post]
  # match '*all', to: 'application#preflight', via: [:options]

  root "static_pages#root"
end
