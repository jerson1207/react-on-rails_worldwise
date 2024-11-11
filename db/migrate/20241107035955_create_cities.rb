class CreateCities < ActiveRecord::Migration[7.1]
  def change
    create_table :cities do |t|
      t.string :cityName
      t.string :country
      t.string :emoji
      t.datetime :date
      t.text :notes
      t.decimal :lat
      t.decimal :lng

      t.timestamps
    end
  end
end
