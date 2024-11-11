import React from 'react'
import { createContext, useState, useEffect, useContext } from "react";

const CitiesContext = createContext();

const getCsrfToken = () => {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta ? meta.getAttribute('content') : '';
};

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({})

  useEffect( function () {
    async function fetchCities() {
      try{
        setIsLoading(true)
        const res = await fetch(`/api/v1/cities`)
        const data = await res.json();
        setCities(data.cities)
      } catch {
        alert('there was an error loading the data')
      } finally {
        setIsLoading(false)
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try{
      setIsLoading(true)
      const res = await fetch(`/api/v1/cities/${id}`)
      const data = await res.json();
      setCurrentCity(data)
    } catch {
      alert('there was an error loading the data')
    } finally {
      setIsLoading(false)
    }
  }

  async function createCity(newCity) {
    try {
      setIsLoading(true)
      const response = await fetch('/api/v1/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken()
        },
        body: JSON.stringify(newCity)
      });

      if (response.ok) { 
        const addedCity = await response.json(); 
        setCities(prevCities => [...prevCities, addedCity]);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false)
    }
  }

  async function deleteCity(id) {
    try {
      setIsLoading(true)
      await fetch(`/api/v1/cities/${id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': getCsrfToken()
        }
      });
      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CitiesContext.Provider 
      value={ { cities, isLoading, currentCity, getCity, createCity, deleteCity } }>
    {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities }