Rails.application.routes.draw do
  root 'pages#index'
  get '*path', to: 'pages#index', constraints: ->(req) { req.format.html?  && !req.path.start_with?('/api') }

  namespace :api do
    namespace :v1 do
      resources :cities
    end
  end
end
