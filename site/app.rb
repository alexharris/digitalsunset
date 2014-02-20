require 'sinatra'
require 'sinatra/activerecord'
require './config/environments' #database configuration

get '/', :user_agent => /(iPhone|Android|BlackBerry)/ do
  erb :"mobile/index", :layout => :mobile
end

get '/' do
  erb :"main/index"
end

get '/app' do
  @gradient = Gradient.new
  erb :"mobile/index", :layout => :mobile
end

get '/gallery', :user_agent => /(iPhone|Android|BlackBerry)/ do
  @gradients = Gradient.order("created_at DESC")
  erb :"gallery/index", :layout => :mobile
end

get '/gallery' do
  @gradients = Gradient.order("created_at DESC")
  erb :"gallery/index"
end

get '/info' do
  erb :"info/index"
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