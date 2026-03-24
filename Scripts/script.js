// Api key, leeg laten bij pushen
const api_key = "fd8ddc68018c4849a3991525261003";

// Haal weer gegevens op bij coordinaten, dit wordt gebruikt voor de geolocatie van de gebruiker
function getWeatherByCoords(lat, lon) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${lat},${lon}&days=7`)
    .then(response => response.json())
    .then(data => updateUI(data))
    .catch(err => console.error(err));
}

// Haal weer gegevens op doormiddel van de stadsnaam
function getWeatherByCity(city) {
    city = getCityTranslation(city);
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${city}&days=7`)
    .then(response => response.json())
    .then(data => updateUI(data))
    .catch(err => console.error(err));
}

// Import de stads vertalingen van de json file
let StadVertalingen = {};

fetch('./Scripts/StadVertalingen.json').then(response=>response.json())
.then(data => {
    StadVertalingen = data;
    initSearch();
})
.catch(err => console.error("Kon JSON niet laden:", err));

// Functie die de vertaling returned als deze bestaat
function getCityTranslation(city) {
    const key = city.toLowerCase();

    console.log(StadVertalingen[key] || city);
    return StadVertalingen[key] || city;
}



// Functie die de tijd van opzoeken returned
function returnDate() {

    const today = new Date();

    const day = today.getDate(); 
    const month = today.getMonth() + 1; 
    const year = today.getFullYear();
    const hour = today.getHours();
    const minutes = today.getMinutes();

    return `${day}/${month}/${year} - ${hour}:${minutes}`;

}

// Functie die een string returned op basis van de UV hoogte
function returnUV(uv) {

    if (uv <= 2) return "Laag";
    else if (uv <= 5) return "Matig";
    else if (uv <= 7) return "Hoog";
    else if (uv <= 10) return "Zeer hoog";
    else return "Extreem";

}

// Functie die de ui van de website update als er een nieuwe zoekresultaat is
function updateUI(data) {

    document.getElementById("date").textContent = returnDate();
    document.getElementById("location-title").textContent = data.location.name;
    document.getElementById("graden").textContent = data.current.temp_c + "°C";
    var uv = data.current.uv;
    document.getElementById("uv-index").textContent = uv + " UV (" + returnUV(uv) + ")";
    document.getElementById("plaatje").src = "https:" + data.current.condition.icon;
    document.getElementById("voelt-als").textContent = data.current.feelslike_c + "°C";
    document.getElementById("wind").textContent = data.current.wind_kph + " km/u";
    document.getElementById("regenkans").textContent =
        data.forecast.forecastday[0].day.daily_chance_of_rain + " %";

    const vooruitzicht = document.querySelector(".vooruitzicht-container");
    vooruitzicht.innerHTML = "";

    // Looped door de 7 dagen voor de 7 day forecast
    data.forecast.forecastday.forEach(day => {

        // Creeerd een div om de forecast in te zetten
        const card = document.createElement("div");
        // Voegt de class toe
        card.classList.add("forecast-card");

        // Zet een variable naar de dag van de loop
        const date = new Date(day.date).toLocaleDateString("nl-NL", { weekday: "short" });

        // Creeerd het blokje met de weers informatie van die dag
        card.innerHTML = `
            <h4>${date}</h4>
            <img src="https:${day.day.condition.icon}" width="40">
            <p>${day.day.maxtemp_c}° / ${day.day.mintemp_c}°</p>
            <p>${day.day.daily_chance_of_rain}%</p>
        `;

        // Voegt het blokje toe
        vooruitzicht.appendChild(card);

    });
}

// Zet het weers zoekopdracht automatisch naar de gebruiker hen locatie als dit toegelaten wordt
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherByCoords(lat, lon);
        },
        error => {
            console.log("Locatie niet beschikbaar");
        }
    );
}

// Checkt of er op enter gedrukt wordt wanneer er gezocht wordt, zodat de gebruiker kan zoeken
function initSearch() {
    const input = document.getElementById("location");
    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            const city = input.value.trim();
            if (city) getWeatherByCity(city);
        }
    });
}

