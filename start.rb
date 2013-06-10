require 'sinatra'
set :public_folder, '.'
set :static_cache_control, :no_cache
get '/' do
  cache_control :no_cache
  send_file 'index.html'
end

get '/multitouch.js' do
  s = ""
  Dir.glob('lib/*.js').each do |f|
    s += File.read(f)
  end
  content_type 'text/javascript'
  s
end
