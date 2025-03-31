const apiKey = "14b8527b783f4ca8ada103648252603";
const apiUrl = "https://api.weatherapi.com/v1/forecast.json";

const locationInput = document.getElementById("locationInput");
const searchButton = document.getElementById("searchButton");
const weatherContainer = document.getElementById("weatherContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
const infoButton = document.getElementById("infoButton");

let displayedLocations = [];

let weatherData = {}; // Definieer het weatherData object hier

window.addEventListener("load", () => {
  const popover = new bootstrap.Popover(infoButton);
  popover.show();
});

searchButton.addEventListener("click", () => {
  const popover = bootstrap.Popover.getInstance(infoButton);
  if (popover) {
    popover.hide();
  }

  const locations = locationInput.value
    .split(",")
    .map((loc) => loc.trim())
    .filter((loc) => loc);

  if (locations.length > 0) {
    weatherContainer.innerHTML = ""; 

    const uniqueLocations = new Set(); 
    let isDuplicate = false;

    locations.forEach((location) => {
      const normalizedLocation = location.toLowerCase(); 

      if (uniqueLocations.has(normalizedLocation)) {
        isDuplicate = true;
      } else {
        uniqueLocations.add(normalizedLocation); 
      }
    });

    if (isDuplicate) {
      alert("Je hebt dezelfde locatie meerdere keren ingevoerd!");
      return; 
    }

    if (locations.length <= 3) {
      locations.forEach((location) => {
        const normalizedLocation = location.toLowerCase(); 

        if (displayedLocations.includes(normalizedLocation)) {
          displayWeatherFromCache(location); 
        } else {
          displayedLocations.push(normalizedLocation);
          fetchWeather(location); 
        }
      });
    } else {
      alert("Je kunt maximaal 3 locaties invoeren.");
    }
  } else {
    alert("Vul minimaal één locatie in!");
  }
});

function fetchWeather(location) {
  const url = `${apiUrl}?key=${apiKey}&q=${location}&days=1&aqi=no&alerts=no`;

  loadingSpinner.classList.remove("d-none");

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      loadingSpinner.classList.add("d-none"); 

      if (data.error) {
        throw new Error(`API Fout: ${data.error.message}`);
      }

      weatherData[location.toLowerCase()] = data;
      updateWeatherDisplay(data); 
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error.message);
      alert("Er is een fout opgetreden: " + error.message);
      loadingSpinner.classList.add("d-none"); 
    });
}

function updateWeatherDisplay(data) {
  const weatherCard = document.createElement("div");
  weatherCard.classList.add(
    "weather-card",
    "p-3",
    "bg-light",
    "rounded",
    "shadow-sm",
    "mb-3"
  );

  weatherCard.innerHTML = `
    <h2 class="fw-bold">${data.location.name}</h2>
    <p class="fs-4">${Math.round(data.current.temp_c)}°C</p>
    <img src="https:${data.current.condition.icon}" alt="${
    data.current.condition.text
  }" class="img-fluid" style="max-width: 100px" />
    <p class="text-muted mt-2">Neerslagkans: ${
      data.forecast.forecastday[0].day.daily_chance_of_rain
    }%</p>
  `;

  weatherContainer.appendChild(weatherCard); 
}

function displayWeatherFromCache(location) {
  const data = weatherData[location.toLowerCase()]; 

  const weatherCard = document.createElement("div");
  weatherCard.classList.add(
    "weather-card",
    "p-3",
    "bg-light",
    "rounded",
    "shadow-sm",
    "mb-3"
  );

  weatherCard.innerHTML = `
    <h2 class="fw-bold">${data.location.name}</h2>
    <p class="fs-4">${Math.round(data.current.temp_c)}°C</p>
    <img src="https:${data.current.condition.icon}" alt="${
    data.current.condition.text
  }" class="img-fluid" style="max-width: 100px" />
    <p class="text-muted mt-2">Neerslagkans: ${
      data.forecast.forecastday[0].day.daily_chance_of_rain
    }%</p>
  `;

  weatherContainer.appendChild(weatherCard); 
}
