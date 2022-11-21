// global variables
let apiKey = `54f39cdde746da7841439818e74d2199`;
let apiUnitsC = `metric`;
let apiUnitsF = `imperial`;
let lat;
let lon;

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

function showUV(response) {
  let uvIndex = response.data.current.uvi;
  document.querySelector("#uv-index").innerHTML = `🌻 ${uvIndex}`;

  if (uvIndex <=2) {
    document.querySelector("#uv-index-assess").innerHTML = `🟢 Low`;
  } else {
    if (uvIndex > 2 && uvIndex <= 5) {
      document.querySelector("#uv-index-assess").innerHTML = `😎 Moderate`;
    } else {
      if (uvIndex > 5 && uvIndex <=7) {
        document.querySelector("#uv-index-assess").innerHTML = `🟠 High`;
      } else {
        if (uvIndex > 7 && uvIndex <= 10) {
          document.querySelector("#uv-index-assess").innerHTML = `🎈 Very high`;
        } else {
          document.querySelector("#uv-index-assess").innerHTML = `🤯 Extreme`;
        }
      }
    }
  }
 
}

function displayWeather(response) {
  currentTempCelsius = response.data.main.temp;
  document.querySelector("#current-temperature").innerHTML = Math.round(response.data.main.temp);

  document.querySelector("#current-city").innerHTML = `🏠 ${response.data.name}, ${response.data.sys.country}`;
  document.querySelector("#current-short-description").innerHTML = `
  <img src="http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png" alt="weather-icon" height="27"> ${response.data.weather[0].main}`;

  
  lat = response.data.coord.lat;
  lon = response.data.coord.lon;
  let apiUrlDateTime= `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=842b36d55cb28eba74a018029d56b04c`;
  axios.get(apiUrlDateTime).then(showDateTime);

  document.querySelector("#highlight-cloudiness").innerHTML = `☁️ ${response.data.clouds.all}%`;
  document.querySelector("#highlight-wind-speed").innerHTML = `${response.data.wind.speed} m/s`;
  checkWind(response);

  axios.get(apiUrlDateTime).then(displaySunriseSunsetLocal);

  document.querySelector("#highlights-humidity-percent").innerHTML = `${response.data.main.humidity}%`;
  checkHumidity(response);
  document.querySelector("#highlishgts-visibility").innerHTML = `${response.data.visibility / 1000} km`;
  checkVisibility(response);

  // display Forecast
  let apiForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${apiUnitsC}&exclude=minutely,hourly&appid=2d96d64425dca1d6eda00d942a281c0d`;
  axios(apiForecast).then(showForecast);

  // uv
  axios(apiForecast).then(showUV);
}

function searchWeatherCity(city) {
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${apiUnitsC}&appid=${apiKey}`;
  axios.get(apiURL).then(displayWeather);

  axios.get(apiURL)
  .catch (function (error) {
    alert('The city has not been found. Please, try again');
  });
}

// searching weather for a Default city
searchWeatherCity("Vinnytsia");

// searching weather for a Search vity
function handleSearch(event) {
  event.preventDefault();
  let city = document.querySelector("#search-input").value.trim();
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

function convertToFahr(event) {
  event.preventDefault();
  let tempFahr = (currentTempCelsius * 9) / 5 + 32;
  document.querySelector("#current-temperature").innerHTML = Math.round(tempFahr);
}

function convertBackToCel(event) {
  event.preventDefault();
  document.querySelector("#current-temperature").innerHTML = Math.round(currentTempCelsius);
}

let leftBarFahrenheitElement = document.querySelector("#left-bar-units-fahrenheit-button");
leftBarFahrenheitElement.addEventListener("click", convertToFahr);

let leftBarCelsiusElement = document.querySelector("#left-bar-units-celsius-button");
leftBarCelsiusElement.addEventListener("click", convertBackToCel);


// forecast 
function showForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let formattedDay = `${days[day]}`;
  return formattedDay;
}

function showForecast(response) {
  let forecastHTML = ``;
  let forecastArray = response.data.daily;

  for (let i = 0; i < 6; i++) {
    forecastHTML = forecastHTML + `
    <div class="col-sm-2">
    <div class="card right-bar-weather-weekly-card">
    <div class="card-body">
      <span id="forecast-day">${showForecastDay(forecastArray[i].dt)}</span>
      <br />
      <span class="day" id="forecast-icon">
        <img src="http://openweathermap.org/img/wn/${forecastArray[i].weather[0].icon}@2x.png" alt="weather-icon" height="27"> 
      </span>
      <br />
      <span id="forecast-max">${Math.round(forecastArray[i].temp.max)}°C</span><span id="forecast-slash"> / </span><span id="forecast-min">${Math.round(forecastArray[i].temp.min)}°C</span>
    </div>
    </div>
  </div>
    `;
  }

  document.querySelector("#forecast").innerHTML = forecastHTML;
}

function showForecastFahr(response) {
  let forecastHTML = ``;
  let forecastArray = response.data.daily;

  for (let i = 0; i < 6; i++) {
    forecastHTML = forecastHTML + `
    <div class="col-2">
    <div class="card right-bar-weather-weekly-card">
    <div class="card-body">
      <span id="forecast-day">${showForecastDay(forecastArray[i].dt)}</span>
      <br />
      <span class="day" id="forecast-icon">
        <img src="http://openweathermap.org/img/wn/${forecastArray[i].weather[0].icon}@2x.png" alt="weather-icon" height="27"> 
      </span>
      <br />
      <span id="forecast-max">${Math.round(forecastArray[i].temp.max)}°F</span><span id="forecast-slash"> / </span><span id="forecast-min">${Math.round(forecastArray[i].temp.min)}°F</span>
    </div>
    </div>
  </div>
    `;
  }

  document.querySelector("#forecast").innerHTML = forecastHTML;
}

function convertForestToFahr(event) {
  event.preventDefault();
  let apiForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${apiUnitsF}&exclude=minutely,hourly&appid=2d96d64425dca1d6eda00d942a281c0d`;
  axios(apiForecast).then(showForecastFahr);
}

function convertForecastToCels(event) {
  event.preventDefault();
  let apiForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${apiUnitsC}&exclude=minutely,hourly&appid=2d96d64425dca1d6eda00d942a281c0d`;
  axios(apiForecast).then(showForecast);
}

let rightBarFahrenheitElement = document.querySelector("#right-bar-fahrenheit-button");
rightBarFahrenheitElement.addEventListener("click", convertForestToFahr);

let rightBarCelsiusElement = document.querySelector("#right-bar-celsius-button");
rightBarCelsiusElement.addEventListener("click", convertForecastToCels);