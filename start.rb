require 'sinatra'
set :public_folder, '.'
get '/' do
  send_file 'index.html'
end
