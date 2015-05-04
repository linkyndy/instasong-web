require_relative "lib/api_secret_authorization"

configure do
  Her::API.setup url: ENV['API_URL'] do |c|
    c.use ApiSecretAuthorization
    c.use Faraday::Request::UrlEncoded
    c.use Her::Middleware::DefaultParseJSON
    c.use Faraday::Adapter::NetHttp
  end
end
