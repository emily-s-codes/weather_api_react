import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [weather, setWeather] = useState([]);
  const [cityName, setCityName] = useState("Berlin");
  const [units, setUnits] = useState("metric")
  const [metric, setMetric] = useState(true)
  const [city, setCity] = useState("")
  const [active, setActive] = useState(false)

  useEffect(() => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=en&appid=${process.env.REACT_APP_API_KEY}&units=metric`)
      .then(res => res.json())
      .then((weather) => {
        setWeather(weather)
      })
  }, [cityName])

  if (weather.weather === undefined) {
    return;
  }

  console.log(weather)

  let dateAccountForTimezone = new Date((new Date().getTime()) + weather.timezone * 1000)
  let updatedLocalTime = dateAccountForTimezone.toISOString().match(/\d\d:\d\d/);
  let weatherIconCode = weather.weather[0].icon;
  let sunriseTimeDateCorrection = new Date(new Date(weather.sys.sunrise + weather.timezone) * 1000);
  let sunriseLocalTime = sunriseTimeDateCorrection.toISOString().slice(11, 16);
  let sunsetTimeDateCorrection = new Date(new Date(weather.sys.sunset + weather.timezone) * 1000);
  let sunsetLocalTime = sunsetTimeDateCorrection.toISOString().slice(11, 16)

  const newSearch = (cityName, units) => {
    setCityName(cityName)
    setActive(true)
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=en&appid=${process.env.REACT_APP_API_KEY}&units=${units}`)
      .then(res => res.json())
      .then((weather) => {
        setWeather(weather)
      })
  }

  const unitsHandler = (e) => {
    setUnits(e.target.value)
    if (e.target.value === "metric") {
      setMetric(true)
    } else {
      setMetric(false)
    }
  }
  console.log(units, metric)

  return (
    <div className="App">
      <section className='wrapper'>
        <h1>Simple Weather App</h1>
        <section className={active ? 'hideSearch' : 'searchTerms'}>
          <input className="cityInput" name="cityInput" id='cityInput' type="text" placeholder='city name' onChange={(e) => setCity(e.target.value)}></input>
          <section className='unitsSection'>
            <label htmlFor="metric">Metric
              <input type="radio" id="metric" name="metricImperial" value="metric" defaultChecked onChange={unitsHandler} />
            </label>
            <label htmlFor="imperial">Imperial
              <input type="radio" id="imperial" name="metricImperial" value="imperial" onChange={unitsHandler} />
            </label>
          </section>
          <button onClick={() => newSearch(city, units)}>Find My City</button>
        </section>
        <section className={active ? '' : 'hideSearch'}>
          <p className='weatherOverview'>{weather.weather[0].description} in {weather.name}</p>
          <img src={`http://openweathermap.org/img/wn/${weatherIconCode}@2x.png`} alt="current weather" />
          <p>Current: {metric ? `${weather.main.temp}°C` : `${weather.main.temp}°F`}</p>
          <p>Wind speed: {metric ? `${weather.wind.speed} meters/sec` : `${weather.wind.speed} miles/hour`}</p>
          <p>Local time: {updatedLocalTime}</p>
          <p>Sunrise: {sunriseLocalTime}</p>
          <p>Sunset: {sunsetLocalTime}</p>
          <p><a href={`https://www.google.com/maps/place/${weather.coord.lat},${weather.coord.lon}`}>[{weather.coord.lat}, {weather.coord.lon}]</a></p>
          <button onClick={() => setActive(false)}>New Search</button>
        </section>
      </section>
    </div>
  );
}

export default App;
