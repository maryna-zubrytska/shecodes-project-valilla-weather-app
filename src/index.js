// showing current date and time
function showDateTime(date) {
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

  return `${dayWeek}, ${hours}:${minutes}`;
}

let currentDateTimeElement = document.querySelector("#current-date-time");
let currentDateTime = new Date();
currentDateTimeElement.innerHTML = showDateTime(currentDateTime);

// variables and functions for showing temperature (Default, SearchCity, MyLocation)
let cityElement = document.querySelector("#current-city");
let tempElement = document.querySelector("#current-temperature");
let descriptionElement = document.querySelector("#current-short-description");

let windStatusHighlightElement = document.querySelector("#highlight-wind-speed");
let windAssessHighlightElement = document.querySelector("#highlight-wind-assess");
let humidityPercentHighlightElement = document.querySelector("#highlights-humidity-percent");
let humidityAssessHighlightElement = document.querySelector("#highlights-humidity-assess");
let visibilityHighlightElement = document.querySelector("#highlishgts-visibility");
let visibilityAssessHighlightElement = document.querySelector("#highlights-visibility-assess");
let sunriseHighlightElement = document.querySelector("#highlights-sunrise");
let sunsetHighlightElement = document.querySelector("#highlights-sunset");
let cloudinessHightlightElement = document.querySelector("#highlight-cloudiness");
let maxTempHightlightElement = document.querySelector("#highlights-max-temp");
let minTempHighlightElement = document.querySelector("#highlights-min-temp");

let apiKey = `54f39cdde746da7841439818e74d2199`;
let apiUnitsC = `metric`;
let apiUnitsF = `imperial`;

// checking humidity 
function checkHumidity(response) {
  if (response.data.main.humidity < 30) {
    humidityAssessHighlightElement.innerHTML = `Dry 🤯`;
   } else {
    if (response.data.main.humidity > 60) {
      humidityAssessHighlightElement.innerHTML = `Wet 😢`;
    } else {
      humidityAssessHighlightElement.innerHTML = `Normal 🙂`;
    }
   }
}

// checking visibility
function checkVisibility(response) {
  if (response.data.visibility >= 10000) {
    visibilityAssessHighlightElement.innerHTML = `Clear 🪄`;
  } else {
    if (response.data.visibility <= 5000) {
      visibilityAssessHighlightElement.innerHTML = `Fog 🌫️`;
    } else {
      visibilityAssessHighlightElement.innerHTML = `Haze 🤔`;
    }
  }
}

// convert unixTimeStamp tp regular time
function convertUnixToTime(response) {
  let unixTimestamp = response;
  let date = new Date(unixTimestamp * 1000);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let formattedSunrise = `${hours}:${minutes}`;
  return formattedSunrise;
 }

function checkWind(response) {
  if (response.data.wind.speed > 17) {
    windAssessHighlightElement.innerHTML = `🎈 Dangerous`;
  } else {
    windAssessHighlightElement.innerHTML = `🍃 Normal`;
  }
}

function displayWeather(response) {
  tempElement.innerHTML = Math.round(response.data.main.temp);

  cityElement.innerHTML = `🧭 ${response.data.name}, ${response.data.sys.country}`;
  descriptionElement.innerHTML = `
  <img src="http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png" alt="weather-icon" height="27"> ${response.data.weather[0].main}`;

  cloudinessHightlightElement.innerHTML = `☁️ ${response.data.clouds.all}%`;
  windStatusHighlightElement.innerHTML = `${response.data.wind.speed} m/s`;
  checkWind(response);
  sunriseHighlightElement.innerHTML = convertUnixToTime(response.data.sys.sunrise);
  sunsetHighlightElement.innerHTML = convertUnixToTime(response.data.sys.sunset);
  humidityPercentHighlightElement.innerHTML = `${response.data.main.humidity}%`;
  checkHumidity(response);
  visibilityHighlightElement.innerHTML = `${response.data.visibility / 1000} km`;
  checkVisibility(response);
  maxTempHightlightElement.innerHTML = `🌡️ ${response.data.main.temp_max}°C`;
  minTempHighlightElement.innerHTML = `❄️ ${response.data.main.temp_min}°C`;
}

function searchWeatherCity(city) {
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${apiUnitsC}&appid=${apiKey}`;
  axios.get(apiURL).then(displayWeather);
}

// searching weather for a Default city
searchWeatherCity("Vinnytsia");

// searching weather for a Seatch vity
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