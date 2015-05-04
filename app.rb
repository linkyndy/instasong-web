require "bundler"
Bundler.require

Dotenv.load

require_relative "environments"

get '/' do
  'Hello Instasong!'
end
