import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const your_API_key = "9b31013c22b3aff48de902907c3404b9";



app.get("/", (req, res) => {
  res.render("index.ejs");
});

let City;
let State;

//const weather = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${your_API_key}`)

app.post("/search", async (req, res) => {
   try{ 
    const city_name = req.body.city;
    const state_name = req.body.state;
    const location = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city_name},${state_name}&appid=${your_API_key}`);
    const latitude = location.data[0].lat;
    const longitude = location.data[0].lon;
    const weather = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=${your_API_key}`)
    const currentTemperature = weather.data.current.temp;
    const feelsLikeTemperature = weather.data.current.feels_like;
    const humidity = weather.data.current.humidity;
    const windSpeed = weather.data.current.wind_speed;
    const dailyHigh = weather.data.daily.max;
    const dailyLow= weather.data.daily.min;

    res.render("index.ejs", { City: city_name, State: state_name, 
       temp: currentTemperature, feels_like: feelsLikeTemperature, Humid: humidity, speed: windSpeed, high: dailyHigh, low: dailyLow
    });
    console.log(weather);
    //console.log(longitude);
   } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
  