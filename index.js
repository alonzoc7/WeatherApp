
// Display days of the week
const weekdays = ["Sun","Mon","Tues","Wed","Thu","Fri","Sat"];
const day = new Date();
for(let i=1; i<7; i++){
    let idText= "day"+i+"Name";
    let dayNum = day.getDay()+i;
    if(dayNum>6){
        dayNum-=7;
    }
    document.getElementById(idText).innerHTML = weekdays[dayNum];
}

// Get latitude and longitude of the location.
let lat = 41.6828;
let long = -88.3515;
let tempUnit = "fahrenheit";

// Retreive Today's Temperature Data
const params = {
	"latitude": lat,
	"longitude": long,
	"current": "temperature_2m",
	"daily": "temperature_2m_max",
	"temperature_unit": tempUnit,
	"wind_speed_unit": "mph",
	"precipitation_unit": "inch",
	"timezone": "GMT"
};
