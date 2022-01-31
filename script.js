var city = "";
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidity = $("#humidity");
var currentWSpeed = $("#wind-speed");
var currentUvindex = $("#uv-index");
var sCity = [];

var APIKey = "cf06d4bf308acb2291d4d85ad2c8ccea";

function displayWeather(e) {
  e.preventDefault();
  if (searchCity.val().trim() !== "") {
    city = searchCity.val().trim();
    currentWeather(city);
  }
}
function currentWeather(city) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&APPID=" +
    APIKey;
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var weathericon = data.weather[0].icon;
      var iconurl =
        "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";
      var date = new Date(data.dt * 1000).toLocaleDateString();
      $(currentCity).html(
        data.name + " (" + date + ")" + "<img src=" + iconurl + ">"
      );

      var tempF = (data.main.temp - 273.15) * 1.8 + 32;
      $(currentTemperature).html(tempF.toFixed(2) + "&#8457");

      $(currentHumidity).html(data.main.humidity + "%");

      var ws = data.wind.speed;
      var windsmph = (ws * 2.237).toFixed(1);
      $(currentWSpeed).html(windsmph + "MPH");

      UVIndex(data.coord.lon, data.coord.lat);
    });
}
function UVIndex(ln, lt) {
  var uvqURL =
    "https://api.openweathermap.org/data/2.5/uvi?appid=" +
    APIKey +
    "&lat=" +
    lt +
    "&lon=" +
    ln;
  fetch(uvqURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      $(currentUvindex).html(data.value);
    });
}

$("#search-button").on("click", displayWeather);
currentWeather("London");
