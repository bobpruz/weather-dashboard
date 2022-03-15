var apiKey = "28dc3ffecf9f41325703aa618a323db2";
var geoUrl = "http://api.openweathermap.org/geo/1.0/direct?";
var url = "http://api.openweathermap.org/data/2.5/onecall?";
var lat = "";
var lon = "";
var exclude = "exclude=minutely,hourly,alerts";
var units = "imperial";
var city = "victoria";
var state = "mn";
var data = [];

fetch(geoUrl + "appid=" + apiKey + "&q=" + city + "," + state + ",us")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log("Lat: " + data[0].lat + " Lon: " + data[0].lon);
  });

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
    console.log(data1.daily[0]);
  });
