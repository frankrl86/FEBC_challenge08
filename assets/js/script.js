// Constants for API key and base URL
const apiKey = "ddc5aa2eec652fe49b8dc9d5151b269b"; // Replace with your actual API key
const baseUrl = "https://api.openweathermap.org/data/2.5/";

// Function to fetch the current weather by city name
function fetchCurrentWeather(city) {
  fetch(`${baseUrl}weather?q=${city}&appid=${apiKey}&units=metric`)
    .then((response) => response.json())
    .then((data) => {
      if (data.cod === "404") {
        alert("City not found");
        return;
      }
      displayCurrentWeather(data);
      fetchForecast(data.coord.lat, data.coord.lon);
    })
    .catch((error) => console.error("Fetching current weather failed:", error));
}

// Function to display the current weather data
function displayCurrentWeather(weatherData) {
  const currentWeatherHTML = `
        <h2 class=font-bold>Current Weather for ${weatherData.name} (${new Date(
    weatherData.dt * 1000
  ).toLocaleDateString()})</h2>
        <img src="https://openweathermap.org/img/wn/${
          weatherData.weather[0].icon
        }.png" alt="Weather icon">
        <p>Temperature: ${weatherData.main.temp} °C</p>
        <p>Wind Speed: ${weatherData.wind.speed} KPH</p>
        <p>Humidity: ${weatherData.main.humidity}%</p>
    `;
  document.getElementById("current-weather").innerHTML = currentWeatherHTML;
}

// Function to fetch the 5-day forecast by geographic coordinates
function fetchForecast(lat, lon) {
  fetch(`${baseUrl}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then((response) => response.json())
    .then((data) => displayForecast(data))
    .catch((error) => console.error("Fetching forecast failed:", error));
}

// Function to display the 5-day forecast data
function displayForecast(forecastData) {
  let forecastHTML = "";
  // Loop over the forecast data for 5 days, each with 8 data points per day
  for (let i = 0; i < forecastData.list.length; i += 8) {
    const forecast = forecastData.list[i];
    forecastHTML += `
            <div class="bg-blue-200 p-4 rounded-lg">
                <h3 class=font-bold>${new Date(
                  forecast.dt * 1000
                ).toLocaleDateString()}</h3>
                <img src="https://openweathermap.org/img/wn/${
                  forecast.weather[0].icon
                }.png" alt="Weather icon">
                <p>Temp: ${forecast.main.temp} °C</p>
                <p>Wind Speed: ${forecast.wind.speed} KPH</p>
                <p>Humidity: ${forecast.main.humidity}%</p>
            </div>
        `;
  }
  document.getElementById("forecast-container").innerHTML = forecastHTML;
}

// Function to handle the search event and call the current weather fetch function
document.getElementById("search-btn").addEventListener("click", () => {
  const city = document.getElementById("search-input").value;
  fetchCurrentWeather(city);
  saveSearchHistory(city);
});

// Function to save search history to localStorage
function saveSearchHistory(city) {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if (history.indexOf(city) === -1) {
    history.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(history));
    displaySearchHistory();
  }
}

// Function to load and display search history from localStorage
function displaySearchHistory() {
  let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
  let historyHTML = "";
  history.forEach((city) => {
    historyHTML += `<button class="w-full bg-gray-300 hover:bg-gray-400 text-left font-bold py-2 px-4 rounded" onclick="fetchCurrentWeather('${city}')">${city}</button>`;
  });
  document.getElementById("search-history").innerHTML = historyHTML;
}

// Load search history on page load
window.onload = displaySearchHistory;
