import { useState, useEffect } from 'react'
import axios from 'axios'

const api_key = import.meta.env.VITE_SOME_KEY
// muuttujassa api_key on nyt käynnistyksessä annettu API-avaimen arvo

const App = () => {

  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    // Initially get all country data from the server
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
      .catch(error => console.error('Error fetching country data:', error))
  }, [])

  useEffect(() => {
    // Filter countries based on search input
    if (search) {
      const filtered = countries.filter(country =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      )
      setFilteredCountries(filtered)

      // Select the country if there's an exact match
      if (filtered.length === 1) {
        setSelectedCountry(filtered[0])
      } else {
        setSelectedCountry(null)
      }
    } else {
      setFilteredCountries([])
      setSelectedCountry(null)
    }
  }, [search, countries])

  useEffect(() => {
    // Fetch weather data for the capital city of the selected country
    if (selectedCountry && selectedCountry.capital) {
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCountry.capital[0]}&appid=${api_key}&units=metric`)
        .then(response => setWeather(response.data))
        .catch(error => console.error('Error fetching weather data:', error))
    } else {
      setWeather(null)
    }
  }, [selectedCountry])

  const renderLanguages = (languages) => {
    return (
      <ul>
        {Object.values(languages).map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
    )
  }

  const handleShowClick = (country) => {
    setSelectedCountry(country)
  }

  return (
    <div>
      find countries
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <br></br>

      {selectedCountry ? (
        <div>
          <h1>{selectedCountry.name.common}</h1>
          <>capital {selectedCountry.capital?.[0]}</>
          <br></br>
          <>area {selectedCountry.area}</>
          <p><b>languages:</b></p>
          {renderLanguages(selectedCountry.languages)}
          <img src={`${selectedCountry.flags.png}?auto=compress&cs=tinysrgb&h=350`}></img>
          {weather ? (
            <div>
              <h2>Weather in {selectedCountry.capital?.[0]}</h2>
              <p>temperature {weather.main.temp} Celcius</p>
              <img src={`https://openweathermap.org/img/wn/${weather.weather?.[0].icon}@2x.png`}></img>
              <p>wind {weather.wind.speed} m/s</p>
            </div>
          ) : (
            <p>Loading weather data...</p>
          )}
        </div>
      ) : (
        <>
        {filteredCountries.length > 10 ? (
          <>Too many matches, specify another filter</>
        ) : (
          filteredCountries.map((country) => (
            <div key={country.cca3}>
              {country.name.common}
              <button onClick={() => handleShowClick(country)}>show</button>
              <br></br>
            </div>
          ))
        )}
        </>
      )}
    </div>
  )
}

export default App