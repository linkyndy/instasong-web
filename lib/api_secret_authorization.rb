class ApiSecretAuthorization < Faraday::Middleware
  def call(env)
    env[:request_headers]['X-API-Secret'] = ENV['API_SECRET']
    @app.call(env)
  end
end
