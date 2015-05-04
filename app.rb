require "bundler"
Bundler.require

Dotenv.load

get '/' do
  'Hello Instasong!'
end
