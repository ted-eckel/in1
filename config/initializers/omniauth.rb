Rails.application.config.middleware.use OmniAuth::Builder do
  provider :developer unless Rails.env.production?
  provider :pocket, ENV['pocket_consumer_key']
end

# Omniauth.config do |config|
#   config.on_failure do
#     redirect_to root_url
#   end
# end
