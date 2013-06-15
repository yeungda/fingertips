require 'sinatra'
set :public_folder, '.'
set :static_cache_control, :no_cache
get '/' do
  cache_control :no_cache
  send_file 'index.html'
end

def concat(glob)
  s = ""
  Dir.glob(glob).each do |f|
    s += File.read(f)
  end
  s
end

get '/multitouch.js' do
  content_type 'text/javascript'
  concat 'lib/input/*.js'
end

get '/demo.js' do
  content_type 'text/javascript'
  concat 'lib/demo/*.js'
end
