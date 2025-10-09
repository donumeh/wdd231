// Weather data gotten from OpenWeatherMap

CITY = "ibadan";
BASE_URL = "http://api.openweathermap.org/data/2.5/";

document.addEventListener("DOMContentLoaded", () => {
  loadWeatherData();
});

const loadWeatherData = async () => {
  await loadCurrentWeather();
  await loadForecastWeather();
};

const getForecast = async () => {
  try {
    const res = await fetch(
      `${BASE_URL}forecast?q=${CITY}&appid=${APPID}&units=metric`,
    );
    const data = await res.json();
    const openForecast = data.list.splice(0, 3);
    const forecastData = [];

    openForecast.map((forecast, index) => {
      const weatherData = {};
      const weatherTemp = forecast["main"]["temp"];
      const weatherDesp = forecast["weather"][0]["description"];
      const weatherTime = getTimeFromDate(forecast["dt_txt"]);

      weatherData.temp = weatherTemp;
      weatherData.desp = weatherDesp;
      weatherData.time = weatherTime;

      forecastData.push(weatherData);
    });

    return forecastData;
  } catch (err) {
    console.log(err);
  }
};

const getCurrentWeather = async () => {
  try {
    const currentWeatherForecast = {};
    let currentWeatherTemp = "";
    let currentWeatherDesp = "";
    const res = await fetch(
      `${BASE_URL}weather?q=${CITY}&appid=${APPID}&units=metric`,
    );
    const data = await res.json();

    currentWeatherTemp = data["main"]["temp"];
    currentWeatherDesp = data["weather"][0]["description"];

    currentWeatherForecast.currentWeatherTemp = currentWeatherTemp;
    currentWeatherForecast.currentWeatherDesp = currentWeatherDesp;

    return currentWeatherForecast;
  } catch (err) {
    console.log(err);
  }
};

const loadCurrentWeather = async () => {
  try {
    const currentWeather = await getCurrentWeather();

    const weatherElement = document.querySelector("#current_weather");
    const mainWeather = document.createElement("div");
    const mainTemp = document.createElement("p");
    const mainDesp = document.createElement("p");

    mainTemp.textContent = `Temp: ${currentWeather.currentWeatherTemp}`;
    mainDesp.textContent = `Description: ${currentWeather.currentWeatherDesp}`;

    mainWeather.appendChild(mainTemp);
    mainWeather.appendChild(mainDesp);
    mainWeather.classList.add("weather-label");

    weatherElement.appendChild(mainWeather);
  } catch (err) {
    console.log(err);
    return -1;
  }
};

const loadForecastWeather = async () => {
  try {
    const forecastWeather = await getForecast();
    const weatherElement = document.querySelector("#current_weather");
    const forecastContainer = document.createElement("div");

    forecastContainer.classList.add("forecast-container");
    forecastWeather.map((period) => {
      const forecastItem = document.createElement("div");
      const forecastTemp = document.createElement("p");
      const forecastDes = document.createElement("p");

      forecastTemp.textContent = `Temp: ${period.temp}`;
      forecastDes.textContent = `Des: ${period.desp}`;

      forecastItem.appendChild(forecastTemp);
      forecastItem.appendChild(forecastDes);

      forecastContainer.appendChild(forecastItem);
    });

    weatherElement.appendChild(forecastContainer);
  } catch (error) {
    console.log(error);
    return -1;
  }
};

const getTimeFromDate = (isoTime) => {
  const timeVariable = new Date(isoTime);
  const hour = timeVariable.getHours();
  const min = timeVariable.getMinutes();
  const sec = timeVariable.getSeconds();

  return `${hour}:${min}:${sec}`;
};
