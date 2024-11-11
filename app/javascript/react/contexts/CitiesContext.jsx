import React, {
  createContext,
  useEffect,
  useContext,
  useReducer,
} from "react";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
}

function reducer(state, action) {
  switch(action.type) {
    case 'loading': 
      return {
        ...state,
        isLoading: true,
      };
    case 'cities/loaded':
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case 'city/loaded':
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload
      };
    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: {},
      }
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      }
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    default:
      throw new Error("Unknown error type");
  }
}

const getCsrfToken = () => {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta ? meta.getAttribute('content') : '';
};

function CitiesProvider({ children }) {
  const [{cities, isLoading, currentCity, error}, dispatch] = useReducer(reducer, initialState)
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({})

  useEffect( function () {
    async function fetchCities() {
      // setIsLoading(true)
      dispatch({ type: "loading" })
      try{
        const res = await fetch(`/api/v1/cities`)
        const data = await res.json();
        // setCities(data.cities)
        dispatch({type: 'cities/loaded', payload: data.cities})
      } catch {
        // alert('there was an error loading the data')
        dispatch({type: 'rejected', payload: "there was an error loading the cities"})
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    if (Number(id) === currentCity.id) return;

    // setIsLoading(true)
    dispatch({ type: "loading" })
    try{
      const res = await fetch(`/api/v1/cities/${id}`)
      const data = await res.json();
      // setCurrentCity(data)
      dispatch({type: 'city/loaded', payload: data})
    } catch {
      // alert('there was an error loading the data')
      dispatch({type: 'rejected', payload: "there was an error loading the city"})
    }
  }

  async function createCity(newCity) {
    // setIsLoading(true)
    dispatch({ type: "loading" })
    try {
      const response = await fetch('/api/v1/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken()
        },
        body: JSON.stringify(newCity)
      });

      const data = await response.json(); 
      dispatch({type: 'city/created', payload: data })
      // if (response.ok) { 
      //   setCities(prevCities => [...prevCities, addedCity]);
      // }
    } catch {
      // console.error('Error creating post:', error);
      dispatch({type: 'rejected', payload: "there was an error loading the city"})
    }
  }

  async function deleteCity(id) {
    // setIsLoading(true)
    dispatch({ type: "loading" })
    try {
      await fetch(`/api/v1/cities/${id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': getCsrfToken()
        }
      });
      // setCities((cities) => cities.filter((city) => city.id !== id));
      dispatch({type: 'city/deleted', payload: id })
    } catch{
      dispatch({type: 'rejected', payload: "there was an error loading the city"})
    }
  }

  return (
    <CitiesContext.Provider 
      value={{ 
        cities, 
        isLoading, 
        currentCity, 
        error, 
        getCity, 
        createCity, 
        deleteCity 
      }}
    >
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