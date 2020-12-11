import React, { useEffect, useState } from 'react';
import './style/App.css';

import axios from 'axios'
import moment from 'moment'
import Spinner from 'react-bootstrap/Spinner'
import Forecast from './components/Forecast'
import AutoSuggest from './components/AutoSuggestField'
import cities from './weather-cities.json'

console.log(process.env.REACT_APP_API_KEY)
const weatherById = placeid => `https://api.openweathermap.org/data/2.5/forecast?id=${placeid}&units=metric&APPID=${process.env.REACT_APP_API_KEY}`
const weatherByGPS = gpsData => `https://api.openweathermap.org/data/2.5/forecast?lat=${gpsData.lat}&lon=${gpsData.lon}&units=metric&appid=${process.env.REACT_APP_API_KEY}`


function App() {
  const [weatherForecast, setWeatherForecast] = useState([])
  const [city, setCity] = useState({ id: 5128581 })//Defualt Value
  const [gps, setGPS] = useState(null)

  const [loading, setLoading] = useState(false)

  const time = moment().hour()
  const checkTime = time % 3 === 0 ? `${time}:00:00` : `${(Math.floor((time + 3 - 1) / 3) * 3) - 3}:00:00`;

  const getGPSData = () => {
    navigator.geolocation.getCurrentPosition(position => {
      let coords = {
        lat: position.coords.latitude.toFixed(5),
        lon: position.coords.longitude.toFixed(5)
      }
      setGPS(coords)
    }, error => {
      if (error.code === error.PERMISSION_DENIED)
        alert('Location Denied.Please enable location for accurate results')
    });
  }

  const getWeather = () => {
    const weatherURL = gps ? weatherByGPS(gps) : weatherById(city.id)
    axios.get(weatherURL)
      .then(res => res.data)
      .then(data => {
        const dailyData = data.list.filter(reading => reading.dt_txt.includes(`${checkTime}`))
        const weather = [data.city, ...dailyData]
        setWeatherForecast(weather)
        setLoading(true)
      })
  }

  useEffect(() => {
    getWeather()
  }, [city])

  useEffect(() => {
    getGPSData()
    if (gps)
      getWeather()
    setGPS(null)
  }, [gps])




  return (
    <div className="App">
      <AutoSuggest data={cities} getCity={cityData => setCity(cityData)} />
      { loading ? <Forecast weatherData={weatherForecast} /> : <Spinner animation="border" variant="primary" />}
    </div>
  );
}

export default App;
