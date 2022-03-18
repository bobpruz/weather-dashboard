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
var historyBtn;

var forecast = function (city, state) {
  city = city.toUpperCase();
  state = state.toUpperCase();
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
          $("#uv-now").text(data1.current.uvi);
          $("#wicon-now").attr(
            "src",
            "http://openweathermap.org/img/wn/" +
              data1.current.weather[0].icon +
              ".png");
          if(data1.current.uvi < 3) {
            $("#uv-now").addClass("uv-favorable");
          } else if (data1.current.uvi > 3 && data1.current.uvi < 6) {
            $("#uv-now").removeClass("uv-favorable");
            $("#uv-now").addClass("uv-moderate");
          } else {
            $("#uv-now").removeClass("uv-favorable");
            $("#uv-now").removeClass("uv-moderate");
            $("#uv-now").addClass("uv-severe");
          }
          
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

var saveHistory = function (city, state) {
  city = city.toUpperCase();
  state = state.toUpperCase();
  $("#history").append(
    '<button id="searchHistory" class="btn historyBtn btn-secondary rounded mb-2 w-100" dataCity="' +
      city +
      '"dataState="' +
      state +
      '">' +
      city +
      ", " +
      state +
      "</button>"
  );
  //create object
  var cityState = {
    city: city,
    state: state,
  };

  var retrievedObject = localStorage.getItem("locations") || "[]";

  console.log(retrievedObject);

  var stored = JSON.parse(retrievedObject);

  stored.push(cityState);

  localStorage.setItem("locations", JSON.stringify(stored));
};

var loadHistory = function () {
  var storedHistory = localStorage.getItem("locations");
  var locationHistory = JSON.parse(storedHistory) || 0;
  if (Array.isArray(locationHistory)) {
    for (var i = 0; i < locationHistory.length; i++) {
      $("#history").append(
        '<button id="searchHistory" class="btn historyBtn btn-secondary rounded mb-2 w-100" dataCity="' +
          locationHistory[i].city +
          '"dataState="' +
          locationHistory[i].state +
          '">' +
          locationHistory[i].city +
          ", " +
          locationHistory[i].state +
          "</button>"
      );
    }
  }
};

var search = function (e) {
  e.preventDefault();
  var city = document.getElementById("city").value;
  var state = document.getElementById("state").value;

  console.log(city);
  console.log(state);

  saveHistory(city, state);

  forecast(city, state);

  document.getElementById("city").value = "";
  document.getElementById("state").value = "";
};

forecast(defaultCity, defaultState);
loadHistory();

searchBtn.on("click", (e) => search(e));

$(document).on("click", ".historyBtn", function (event) {
  var locale = $(this).text();
  var locales = locale.split(", ");
  var cityHistory = locales[0];
  var stateHistory = locales[1];
  forecast(cityHistory, stateHistory);
});
