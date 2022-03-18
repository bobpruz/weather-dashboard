var apiKey = "28dc3ffecf9f41325703aa618a323db2";
var geoUrl = "http://api.openweathermap.org/geo/1.0/direct?";
var url = "http://api.openweathermap.org/data/2.5/onecall?";
var lat = "";
var lon = "";
var exclude = "exclude=minutely,hourly,alerts";
var units = "imperial";
var searchBtn = $("#search");
var dateNow = dayjs().format("MM/DD/YYYY");
var defaultCity = "Minneapolis";
var defaultState = "MN";

var forecast = function (city, state) {
  fetch(geoUrl + "appid=" + apiKey + "&q=" + city + "," + state + ",us")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      fetch(
        url +
          "appid=" +
          apiKey +
          "&units=" +
          units +
          "&" +
          exclude +
          "&lon=" +
          data[0].lon +
          "&lat=" +
          data[0].lat
      )
        .then(function (weather) {
          return weather.json();
        })
        .then(function (data1) {
          $("#city-search").text(city + ", " + state + " " + dateNow);
          $("#temp-now").text(
            "Temperature: " + data1.current.temp + " \u00B0F"
          );
          $("#wind-now").text(
            "Wind Speed: " + data1.current.wind_speed + " MPH"
          );
          $("#humidity-now").text("Humidity: " + data1.current.humidity + " %");
          $("#uv-now").text("UV Index: " + data1.current.uvi);
          $("#wicon-now").attr(
            "src",
            "http://openweathermap.org/img/wn/" +
              data1.current.weather[0].icon +
              ".png"
          );
          var s = 1;

          for (var i = 0; i < data1.daily.length && i < 5; i++) {
            $("#wicon-" + s).attr(
              "src",
              "http://openweathermap.org/img/wn/" +
                data1.daily[i].weather[0].icon +
                ".png"
            );
            $("#temp-" + s).text(
              "Temp: " + data1.daily[i].temp.day + " \u00B0F"
            );
            $("#wind-" + s).text(
              "Wind Speed: " + data1.daily[i].wind_speed + " MPH"
            );
            $("#humidity-" + s).text(
              "Humidity: " + data1.daily[i].humidity + " %"
            );
            var date = dayjs().add(s, "days");
            var newDate = date.$M + "/" + date.$D + "/" + date.$y;
            $("#d" + s).text(newDate);
            s++;
          }
        });
    });
};

var saveHistory = function(city, state) {
  $("#history").append('<button id="searchHistory" class="btn historyBtn btn-primary rounded mb-2 w-100" dataCity="' + city + '"dataState="' + state + '">' + city + ", " + state + '</button>')
}

var search = function (e) {
  e.preventDefault();
  var city = document.getElementById("city").value;
  var state = document.getElementById("state").value;

  console.log(city);
  console.log(state);

  saveHistory(city, state);

  forecast(city, state);
};

forecast(defaultCity, defaultState);

searchBtn.on("click", (e) => search(e));
