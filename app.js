// jshint esversion:6
const express = require("express");
const https = require("https");
// we don't need to install https, cause it's bundled with node project.
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  const query = req.body.cityName;
  const apiKey = "ebefc39a80dbb56f309f9d18de927602";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + apiKey;
  // const url ="https://api.openweathermap.org/data/2.5/weather?q=London&appid=ebefc39a80dbb56f309f9d18de927602";
  // 只是写错了一个单词weather/forecast，最后的结果也是天差地远
  https.get(url, function(response) {
    console.log(response.statusCode);

    response.on("data", function(data) {

      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write("<h1>the temperature is " + temp + "degrees Celcius.</h1>");
      res.write("<p>The weather in " + query + " is currently " + weatherDescription + ".</p>");
      res.write("<img src =" + imageURL + ">");
      res.send();
    });
  });
});

app.listen(3000, function() {
  console.log("Server is running on port 3000");
});
