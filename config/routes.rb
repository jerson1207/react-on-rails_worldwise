Rails.application.routes.draw do
  root 'pages#index'
  get '*path', to: 'pages#index', constraints: ->(req) { req.format.html? }
end
