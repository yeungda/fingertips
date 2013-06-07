require 'sinatra'
set :public_folder, '.'
set :static_cache_control, :no_cache
get '/' do
  cache_control :no_cache
  send_file 'index.html'
end
