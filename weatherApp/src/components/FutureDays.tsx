// Getting future weather data is not supported in the free tier of openweathermap.
import { useEffect } from "react";

interface Props {
  location: string;
}
function FutureDays({ location }: Props) {
  // Find the days of the week and their temps
  const weekdays = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
  let weekInfo = [];
  const day = new Date();
  for (let i = 1; i < 7; i++) {
    let dayNum = day.getDay() + i;
    if (dayNum > 6) {
      dayNum -= 7;
    }
    let dayItem = { dayName: weekdays[dayNum], temp: "78", img: "imgLink" };
    weekInfo.push(dayItem);
  }
  // Retrieve the weather forecast data for the given location.
  const getForecast = async (city: string) => {
    try {
      const url = `api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=${6}&appid=${
        import.meta.env.VITE_APP_ID
      }`;
      const resp = await fetch(url);
      const data = await resp.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getForecast(location);
  }, []);
  return (
    <div className="accordion" id="accordionExample">
      {weekInfo.map((dayInfo, index) => (
        <div className="accordion-item" key={"collapse" + index}>
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={"#collapse" + index}
              aria-expanded="true"
              aria-controls={"collapse" + index}
            >
              <p>
                {dayInfo.dayName} {dayInfo.temp}
              </p>
              <img src={dayInfo.img} alt="weather_icon" />
            </button>
          </h2>
          <div
            id={"collapse" + index}
            className="accordion-collapse collapse show"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FutureDays;
