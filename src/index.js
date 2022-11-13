// global variables
let apiKey = `54f39cdde746da7841439818e74d2199`;
let apiUnitsC = `metric`;
let apiUnitsF = `imperial`;

 function displaySunriseSunsetLocal (response) {
  let timezone = response.data.timezone;
  let dateSunrise = new Date(response.data.current.sunrise * 1000);
  let dateSunset = new Date(response.data.current.sunset * 1000);

  let formattedDateSunrise = new Intl.DateTimeFormat("default", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
  }).format(dateSunrise); 

  let formattedDateSunset = new Intl.DateTimeFormat("default", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
  }).format(dateSunset); 

  document.querySelector("#highlights-sunrise").innerHTML = `${formattedDateSunrise}`;
  document.querySelector("#highlights-sunset").innerHTML = `${formattedDateSunset}`;
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
let timezone = response.data.timezone;
let date = new Date();
 let formattedDate = new Intl.DateTimeFormat("default", {
  weekday: "long",
  hour: "numeric",
  minute: "2-digit",
  timeZone: timezone,
}).format(date); 

document.querySelector("#current-date-time").innerHTML = `🧭 Local time <br> ⏳ ${formattedDate}`;
}

function displayWeather(response) {
  currentTempCelsius = response.data.main.temp;
  document.querySelector("#current-temperature").innerHTML = Math.round(response.data.main.temp);

  document.querySelector("#current-city").innerHTML = `🏠 ${response.data.name}, ${response.data.sys.country}`;
  document.querySelector("#current-short-description").innerHTML = `
  <img src="http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png" alt="weather-icon" height="27"> ${response.data.weather[0].main}`;

  
  let lat = response.data.coord.lat;
  let lon = response.data.coord.lon;
  let apiUrlDateTime= `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=6e6ec494746b5229a9f2d526478c924c`;
  axios.get(apiUrlDateTime).then(showDateTime);

  document.querySelector("#highlight-cloudiness").innerHTML = `☁️ ${response.data.clouds.all}%`;
  document.querySelector("#highlight-wind-speed").innerHTML = `${response.data.wind.speed} m/s`;
  checkWind(response);

  axios.get(apiUrlDateTime).then(displaySunriseSunsetLocal);

  document.querySelector("#highlights-humidity-percent").innerHTML = `${response.data.main.humidity}%`;
  checkHumidity(response);
  document.querySelector("#highlishgts-visibility").innerHTML = `${response.data.visibility / 1000} km`;
  checkVisibility(response);

  maxTempCelsius = response.data.main.temp_max;
  minTempCelsius = response.data.main.temp_min;
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

let currentTempCelsius = null;
let maxTempCelsius = null;
let minTempCelsius = null;

function convertToFahr(event) {
  event.preventDefault();
  let tempFahr = (currentTempCelsius * 9) / 5 + 32;
  document.querySelector("#current-temperature").innerHTML = Math.round(tempFahr);

  let maxTempFahr = Math.round((maxTempCelsius * 9) / 5 + 32);
  document.querySelector("#highlights-max-temp").innerHTML = (`🌡️ ${maxTempFahr}°F`);

  let minTempFahr = Math.round((minTempCelsius * 9) / 5 + 32);
  document.querySelector("#highlights-min-temp").innerHTML = (`❄️ ${minTempFahr}°F`);
}

function convertBackToCel(event) {
  event.preventDefault();
  document.querySelector("#current-temperature").innerHTML = Math.round(currentTempCelsius);
  document.querySelector("#highlights-max-temp").innerHTML = (`🌡️ ${Math.round(maxTempCelsius)}°C`);
  document.querySelector("#highlights-min-temp").innerHTML = (`❄️ ${Math.round(minTempCelsius)}°C`);
}

let leftBarFahrenheitElement = document.querySelector("#left-bar-units-fahrenheit-button");
leftBarFahrenheitElement.addEventListener("click", convertToFahr);

let leftBarCelsiusElement = document.querySelector("#left-bar-units-celsius-button");
leftBarCelsiusElement.addEventListener("click", convertBackToCel);