import { useEffect, useState } from 'react';
import './App.css';


function App() {
  const [weather, setWeather] = useState([]);
  const [cityName, setCityName] = useState("Berlin");

  useEffect(() => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&lang=de&appid=${process.env.REACT_APP_API_KEY}&units=metric`)
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
  // onClick={setCity(`Leipzig`)}
  return (
    <div className="App">
      <div className='wrapper'>
        <button onClick={() => setCityName("Leipzig")}>Leipzig</button>
        <button onClick={() => setCityName("München")}>München</button>
        <button onClick={() => setCityName("Wien")}>Wien</button>
        <button onClick={() => setCityName("Hamburg")}>Hamburg</button>
        <p className='weatherOverview'>{weather.weather[0].description} in {weather.name}</p>
        <img src={`http://openweathermap.org/img/wn/${weatherIconCode}@2x.png`} alt="current weather" />
        <p>Current: {weather.main.temp}°C</p>
        <p>Wind speed: {weather.wind.speed} km/h</p>
        <p>Local time: {updatedLocalTime}</p>
      </div>
    </div>
  );
}

export default App;
