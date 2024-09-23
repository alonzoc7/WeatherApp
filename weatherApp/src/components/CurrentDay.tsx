import { useRef, useState } from "react";
import Invalid from "./Invalid";
import "./CurrentDay.css";
import celc from "../images/celc.png";
import faren from "../images/faren.png";
import magnify from "../images/search.png";

function CurrentDay() {
  // Set state variables using array destructuring on the vals useState returns
  const [location, setLocation] = useState("");
  const [unit, setUnit] = useState("imperial");
  const [validSearch, setValidSearch] = useState(true);
  const [weatherData, setWeatherData] = useState({
    temp: 0,
    temp_min: 0,
    temp_max: 0,
    humidity: 0,
    icon: "",
    desc: "",
    name: "",
  });

  const inputRef = useRef(null);
  const day = new Date();
  // Retrieve the current weather data for the given location.
  const getWeather = async (loc: string, un: string) => {
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${loc}&units=${un}&appid=${
        import.meta.env.VITE_APP_ID
      }`;
      const resp = await fetch(url);
      if (resp.status == 200) {
        const data = await resp.json();
        setWeatherData({
          temp: Math.floor(data.main.temp),
          temp_min: Math.floor(data.main.temp_min),
          temp_max: Math.floor(data.main.temp_max),
          humidity: Math.floor(data.main.humidity),
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          desc: data.weather[0].description,
          name: data.name,
        });
        setValidSearch(true);
        console.log(data);
      } else if (resp.status == 404) {
        // display not found message
        setValidSearch(false);
        console.log("404 not found, invalid search.");
      } else if (resp.status == 400) {
        setValidSearch(false);
        console.log("400 Bad Request.");
      }
      // Catch for server-side issues too!
    } catch (err) {
      console.log("In catch block: " + err);
    }
  };

  const handleSearchClick = () => {
    if (inputRef.current) {
      setLocation(inputRef.current["value"]);
      getWeather(inputRef.current["value"], unit);
    } else {
      console.log("No inputRef");
    }
  };
  const renderWeather = () => {
    if (location) {
      if (validSearch) {
        return (
          <div id="weatherContainer">
            <h2>
              {weatherData.name}, {day.toDateString()}
            </h2>
            <h3>{weatherData.desc}</h3>
            <img id="weatherIcon" src={weatherData.icon} alt="weather image" />
            <h3>
              {weatherData.temp}&deg;{unit == "imperial" ? "F" : "C"}
            </h3>
            <div id="tempContainer">
              <div className="tempDiv">
                <h3 id="lo">Lo:</h3>
                <h3>
                  {weatherData.temp_min}&deg;{unit == "imperial" ? "F" : "C"}
                </h3>
              </div>
              <div className="tempDiv">
                <h3 id="hi"> Hi:</h3>
                <h3>
                  {weatherData.temp_max}
                  &deg;{unit == "imperial" ? "F" : "C"}
                </h3>
              </div>
            </div>
          </div>
        );
      } else {
        return Invalid();
      }
    }
    return (
      <div id="welcomeContainer">
        <h1>Welcome to my Weather App!</h1>
        <p>To get started, search a city name</p>
      </div>
    );
  };
  return (
    <div id="mainContainer">
      <div id="searchContainer" className="input-group mb-3">
        <input
          ref={inputRef}
          type="text"
          id="textBox"
          className="form-control"
          aria-label="locationLabel"
          aria-describedby="inputGroup-sizing-default"
        />
        <button id="searchButton">
          <img
            id="magnifyIcon"
            src={magnify}
            alt="search"
            onClick={handleSearchClick}
          />
        </button>
      </div>
      {renderWeather()}
      <div id="bottomContainer">
        <button
          id="unitButton"
          onClick={() => {
            let un = unit;
            unit == "imperial" ? (un = "metric") : (un = "imperial");
            setUnit(un);
            if (inputRef.current) {
              getWeather(inputRef.current["value"], un);
            }
          }}
        >
          <img
            id="unitIcon"
            src={unit == "imperial" ? faren : celc}
            alt="unit button"
          />
        </button>
        <a id="credit" href="https://openweathermap.org/api">
          Powered by OpenWeather API
        </a>
      </div>
    </div>
  );
}
export default CurrentDay;
