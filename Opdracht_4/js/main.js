const apiKey = "14b8527b783f4ca8ada103648252603";
const apiUrl = "https://api.weatherapi.com/v1/forecast.json";

const locationInput = document.getElementById("locationInput");
const searchButton = document.getElementById("searchButton");
const locationElement = document.getElementById("location");
const temperatureElement = document.getElementById("temperature");
const iconElement = document.getElementById("weatherIcon");
const precipitationElement = document.getElementById("precipitation");
const loadingSpinner = document.getElementById("loadingSpinner");

searchButton.addEventListener("click", () => {
  const location = locationInput.value.trim();
  if (location) {
    fetchWeather(location);
  } else {
    alert("Vul een locatie in!");
  }
});

function fetchWeather(location) {
  const url = `${apiUrl}?key=${apiKey}&q=${location}&days=1&aqi=no&alerts=no`;

  loadingSpinner.classList.remove("d-none"); // Spinner laten zien

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      loadingSpinner.classList.add("d-none"); // Spinner verbergen

      if (data.error) {
        throw new Error(`API Fout: ${data.error.message}`);
      }

      locationElement.textContent = data.location.name;
      temperatureElement.textContent = `${Math.round(data.current.temp_c)}°C`;

      iconElement.src = `https:${data.current.condition.icon}`;
      iconElement.alt = data.current.condition.text;
      iconElement.classList.remove("d-none");

      const rainChance = data.forecast.forecastday[0].day.daily_chance_of_rain;
      precipitationElement.textContent = `Neerslagkans: ${rainChance}%`;
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error.message);
      alert("Er is een fout opgetreden: " + error.message);

      locationElement.textContent = "Locatie niet gevonden";
      temperatureElement.textContent = "";
      precipitationElement.textContent = "";
      iconElement.src = "";
      iconElement.classList.add("d-none"); 
      loadingSpinner.classList.add("d-none");
    });
}
