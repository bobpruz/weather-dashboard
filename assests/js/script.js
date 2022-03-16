var apiKey = "28dc3ffecf9f41325703aa618a323db2";
var geoUrl = "http://api.openweathermap.org/geo/1.0/direct?";
var url = "http://api.openweathermap.org/data/2.5/onecall?";
var lat = "";
var lon = "";
var exclude = "exclude=minutely,hourly,alerts";
var units = "imperial";

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
          $("#city-search").text(city + ", " + state)
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
          var s = 1

          for (var i = 0; i < data1.daily.length && i < 5; i++) {
            $("#wicon-" + s).attr(
              "src",
              "http://openweathermap.org/img/wn/" +
                data1.daily[i].weather[0].icon +
                ".png"
            );
            $("#temp-" + s).text("Temp: " + data1.daily[i].temp.day + " \u00B0F");
            $("#wind-" + s).text(
              "Wind Speed: " + data1.daily[i].wind_speed + " MPH"
            );
            $("#humidity-" + s).text("Humidity: " + data1.daily[i].humidity + " %");
            s++
          }
        });
    });
};

forecast("Thayer", "IA");
