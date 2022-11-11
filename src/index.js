// global variables
let apiKey = `54f39cdde746da7841439818e74d2199`;
let apiUnitsC = `metric`;
let apiUnitsF = `imperial`;

// convert unixTimeStamp to regular time
function formattedDateTime(timestamp) {
  let date = new Date(timestamp);

  let daysWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let dayWeekIndex = date.getDay();
  let dayWeek = daysWeek[dayWeekIndex];

  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let formattedTime = `${dayWeek}, ${hours}:${minutes}`;
  return formattedTime;
 }

// checking humidity 
function checkHumidity(response) {
  if (response.data.main.humidity < 30) {
    document.querySelector("#highlights-humidity-assess").innerHTML = `Dry 🤯`;
   } else {
    if (response.data.main.humidity > 60) {
      document.querySelector("#highlights-humidity-assess").innerHTML = `Wet 😢`;
    } else {
      document.querySelector("#highlights-humidity-assess").innerHTML = `Normal 🙂`;
    }
   }
}

// checking visibility
function checkVisibility(response) {
  if (response.data.visibility >= 10000) {
    document.querySelector("#highlights-visibility-assess").innerHTML = `Clear 🪄`;
  } else {
    if (response.data.visibility <= 5000) {
      document.querySelector("#highlights-visibility-assess").innerHTML = `Fog 🌫️`;
    } else {
      document.querySelector("#highlights-visibility-assess").innerHTML = `Haze 🤔`;
    }
  }
}

function checkWind(response) {
  if (response.data.wind.speed > 17) {
    document.querySelector("#highlight-wind-assess").innerHTML = `🎈 Dangerous`;
  } else {
    document.querySelector("#highlight-wind-assess").innerHTML = `🍃 Normal`;
  }
}

function showDateTime(response) {
 document.querySelector("#current-date-time").innerHTML = `${response.dayOfWeek}, ${response.hour}:${response.minute}`;
}

function displayWeather(response) {
  document.querySelector("#current-temperature").innerHTML = Math.round(response.data.main.temp);

  document.querySelector("#current-city").innerHTML = `🏠 ${response.data.name}, ${response.data.sys.country}`;
  document.querySelector("#current-short-description").innerHTML = `
  <img src="http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png" alt="weather-icon" height="27"> ${response.data.weather[0].main}`;

  
  let lat = response.data.coord.lat;
  let lon = response.data.coord.lon;
  let apiUrlDateTime = `https://www.timeapi.io/api/Time/current/coordinate?latitude=${lat}&longitude=${lon}`;
  console.log(apiUrlDateTime);
  axios.get(apiUrlDateTime).then(showDateTime);

  document.querySelector("#highlight-cloudiness").innerHTML = `☁️ ${response.data.clouds.all}%`;
  document.querySelector("#highlight-wind-speed").innerHTML = `${response.data.wind.speed} m/s`;
  checkWind(response);
  document.querySelector("#highlights-sunrise").innerHTML = formattedDateTime(response.data.sys.sunrise * 1000);
  document.querySelector("#highlights-sunset").innerHTML = formattedDateTime(response.data.sys.sunset * 1000);
  document.querySelector("#highlights-humidity-percent").innerHTML = `${response.data.main.humidity}%`;
  checkHumidity(response);
  document.querySelector("#highlishgts-visibility").innerHTML = `${response.data.visibility / 1000} km`;
  checkVisibility(response);
  document.querySelector("#highlights-max-temp").innerHTML = `🌡️ ${Math.round(response.data.main.temp_max)}°C`;
  document.querySelector("#highlights-min-temp").innerHTML = `❄️ ${Math.round(response.data.main.temp_min)}°C`;
}

function searchWeatherCity(city) {
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${apiUnitsC}&appid=${apiKey}`;
  axios.get(apiURL).then(displayWeather);
}

// searching weather for a Default city
searchWeatherCity("Vinnytsia");

// searching weather for a Search vity
function handleSearch(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value;
  searchWeatherCity(city);
}
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSearch);

// searching weather for a Location city
function getLocationSuccess (position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrlLocation = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${apiUnitsC}&appid=${apiKey}`;
  
  axios.get(apiUrlLocation).then(displayWeather);
}
function getLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getLocationSuccess);
}
let myLocationElement = document.querySelector("#current-location-button");
myLocationElement.addEventListener("click", getLocation);

