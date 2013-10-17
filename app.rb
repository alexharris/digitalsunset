require 'sinatra'
require 'sinatra/activerecord'
require './config/environments' #database configuration

get '/' do
    @gradients = Gradient.order("created_at DESC")
    erb :"gradients/index"
end

get '/gradients/create' do
  @gradient = Gradient.new
  erb :"gradients/create"
end

post '/gradients' do
  @gradient = Gradient.new(params[:gradient])
  if @gradient.save
    redirect "/"
  else
    erb :"gradients/create"
  end
end

class Gradient < ActiveRecord::Base
end