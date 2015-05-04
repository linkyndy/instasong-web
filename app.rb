require "bundler"
Bundler.require

Dotenv.load

require_relative "environments"

get '/' do
  'Hello Instasong!'

  if session['access_token']
    "<a href='#{url('logout')}'>Logout</a>"
  else
    "<a href='#{url('login')}'>Login</a>"
  end
end

get '/login' do
  session['oauth'] = Koala::Facebook::OAuth.new(
    ENV['FACEBOOK_APP_ID'], ENV['FACEBOOK_APP_SECRET'], url('oauth-callback'))
  redirect session['oauth'].url_for_oauth_code
end

get '/logout' do
  session['oauth'] = session['access_token'] = nil
  redirect '/'
end

get '/oauth-callback' do
  session['access_token'] = session['oauth'].get_access_token(params[:code])
  redirect '/'
end
