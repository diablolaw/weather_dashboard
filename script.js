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
      forecast(data.id);
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

function forecast(cityid) {
  var dayover = false;
  var queryforcastURL =
    "https://api.openweathermap.org/data/2.5/forecast?id=" +
    cityid +
    "&appid=" +
    APIKey;
  fetch(queryforcastURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      for (i = 0; i < 5; i++) {
        var date = new Date(
          response.list[(i + 1) * 8 - 1].dt * 1000
        ).toLocaleDateString();
        var iconcode = response.list[(i + 1) * 8 - 1].weather[0].icon;
        var iconurl = "https://openweathermap.org/img/wn/" + iconcode + ".png";
        var tempK = response.list[(i + 1) * 8 - 1].main.temp;
        var tempF = ((tempK - 273.5) * 1.8 + 32).toFixed(2);
        var humidity = response.list[(i + 1) * 8 - 1].main.humidity;

        $("#fDate" + i).html(date);
        $("#fImg" + i).html("<img src=" + iconurl + ">");
        $("#fTemp" + i).html(tempF + "&#8457");
        $("#fHumidity" + i).html(humidity + "%");
      }
    });
}

$("#search-button").on("click", displayWeather);
currentWeather("London");
