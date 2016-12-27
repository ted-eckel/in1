Rails.application.config.middleware.use OmniAuth::Builder do
  provider :developer unless Rails.env.production?
  provider :pocket, ENV['pocket_consumer_key']
end
