class Api::V1::CitiesController < ApplicationController

  def index
    cities = City.all

    render json: {
      cities: cities.map do |city|
        {
          cityName: city.cityName,
          country: city.country,
          emoji: city.emoji,
          date: city.date.iso8601,
          notes: city.notes,
          position: {
            lat: city.lat,
            lng: city.lng
          },
          id: city.id
        }
      end
    }
  end

  def show
    city = City.find(params[:id])

    render json: {
      cityName: city.cityName,
      country: city.country,
      emoji: city.emoji,
      date: city.date.iso8601,
      notes: city.notes,
      position: {
        lat: city.lat,
        lng: city.lng
      },
      id: city.id
    }
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'City not found' }, status: :not_found
  end

  def create
    city = City.new(city_params)

    if city.save
      render json: {
        cityName: city.cityName,
        country: city.country,
        emoji: city.emoji,
        date: city.date.iso8601,
        notes: city.notes,
        position: {
          lat: city.lat,
          lng: city.lng
        },
        id: city.id
      }, status: :created
    else
      render json: { errors: city.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    city = City.find(params[:id])
    city.destroy

    render json: { message: 'City deleted successfully' }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'City not found' }, status: :not_found
  end

  private

  def city_params
    params.require(:city).permit(:cityName, :country, :emoji, :date, :notes, :lat, :lng)
  end
end