require 'sinatra'
require 'sinatra/activerecord'
require './config/environments' #database configuration

get '/', :agent => /iPhone/ do
    @gradient = Gradient.new
    erb :"gradients/iPhone"
end

get '/' do
    @gradient = Gradient.new
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

get '/gradients/show' do
  @gradients = Gradient.order("created_at DESC")
  erb :"gradients/show"
end


class Gradient < ActiveRecord::Base
end