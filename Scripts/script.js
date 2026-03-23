const api_key = "";

function getWeatherByCoords(lat, lon) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${lat},${lon}&days=7`)
    .then(response => response.json())
    .then(data => updateUI(data))
    .catch(err => console.error(err));
}

function getWeatherByCity(city) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${city}&days=7`)
    .then(response => response.json())
    .then(data => updateUI(data))
    .catch(err => console.error(err));
}

function returnDate() {

    const today = new Date();

    const day = today.getDate(); 
    const month = today.getMonth() + 1; 
    const year = today.getFullYear();
    const hour = today.getHours();
    const minutes = today.getMinutes();

    return `${day}/${month}/${year} - ${hour}:${minutes}`;

}

function updateUI(data) {

    document.getElementById("date").textContent = returnDate();
    document.getElementById("location-title").textContent = data.location.name;
    document.getElementById("graden").textContent = data.current.temp_c + "°C";
    document.getElementById("plaatje").src = "https:" + data.current.condition.icon;
    document.getElementById("voelt-als").textContent = data.current.feelslike_c + "°C";
    document.getElementById("wind").textContent = data.current.wind_kph + " km/u";
    document.getElementById("regenkans").textContent =
        data.forecast.forecastday[0].day.daily_chance_of_rain + " %";

    const vooruitzicht = document.querySelector(".vooruitzicht-container");
    vooruitzicht.innerHTML = "";

    data.forecast.forecastday.forEach(day => {

        const card = document.createElement("div");
        card.classList.add("forecast-card");

        const date = new Date(day.date).toLocaleDateString("nl-NL", { weekday: "short" });

        card.innerHTML = `
            <h4>${date}</h4>
            <img src="https:${day.day.condition.icon}" width="40">
            <p>${day.day.maxtemp_c}° / ${day.day.mintemp_c}°</p>
            <p>${day.day.daily_chance_of_rain}%</p>
        `;

        vooruitzicht.appendChild(card);

    });
}

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

document.getElementById("location").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        const city = document.getElementById("location").value;
        if (city) getWeatherByCity(city);
    }
});

