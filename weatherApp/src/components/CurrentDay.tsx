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
          <>
            <div id="weatherContainer">
              <p>
                {weatherData.name}, {day.toDateString()}
              </p>
              <p>{weatherData.desc}</p>
              <img
                id="weatherIcon"
                src={weatherData.icon}
                alt="weather image"
              />
              <p>
                {weatherData.temp}&deg;{unit == "imperial" ? "F" : "C"}
              </p>

              <p>
                Lo: {weatherData.temp_min}&deg;{unit == "imperial" ? "F" : "C"}{" "}
                Hi: {weatherData.temp_max}
                &deg;{unit == "imperial" ? "F" : "C"}
              </p>
            </div>
          </>
        );
      } else {
        return Invalid();
      }
    }
    return (
      <>
        <h1>Welcome to my Weather App!</h1>
        <p>To get started, search a city name!</p>
      </>
    );
  };
  return (
    <div id="mainContainer">
      <div id="searchContainer">
        <div className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">
            City Name:
          </span>
          <input
            ref={inputRef}
            type="text"
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
      </div>
      {renderWeather()}
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
    </div>
  );
}
export default CurrentDay;
