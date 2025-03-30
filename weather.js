document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const locationInput = document.getElementById('locationInput');
    const weatherIcon = document.getElementById('weather-icon');
    const temperature = document.getElementById('temperature');
    const description = document.getElementById('description');
    const location = document.getElementById('location');
    const forecastContainer = document.getElementById('forecastContainer');

    // OpenWeatherMap API configuration
    const API_KEY = ''; // Add your OpenWeatherMap API key here
    const BASE_URL = 'https://api.openweathermap.org/data/2.5';

    // Function to get weather icon
    const getWeatherIcon = (iconCode) => {
        const iconMap = {
            '01d': 'sun',
            '01n': 'moon',
            '02d': 'cloud-sun',
            '02n': 'cloud-moon',
            '03d': 'cloud',
            '03n': 'cloud',
            '04d': 'cloud',
            '04n': 'cloud',
            '09d': 'cloud-showers-heavy',
            '09n': 'cloud-showers-heavy',
            '10d': 'cloud-rain',
            '10n': 'cloud-rain',
            '11d': 'bolt',
            '11n': 'bolt',
            '13d': 'snowflake',
            '13n': 'snowflake',
            '50d': 'smog',
            '50n': 'smog'
        };
        return iconMap[iconCode] || 'cloud';
    };

    // Function to convert Kelvin to Celsius
    const kelvinToCelsius = (kelvin) => {
        return Math.round(kelvin - 273.15);
    };

    // Function to format date
    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    // Function to get current weather
    const getCurrentWeather = async (city) => {
        try {
            const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}`);
            if (!response.ok) throw new Error('City not found');
            const data = await response.json();
            
            weatherIcon.innerHTML = `<i class="fas fa-${getWeatherIcon(data.weather[0].icon)}"></i>`;
            temperature.textContent = `${kelvinToCelsius(data.main.temp)}°C`;
            description.textContent = data.weather[0].description;
            location.textContent = `${data.name}, ${data.sys.country}`;
            
            return data.coord;
        } catch (error) {
            throw error;
        }
    };

    // Function to get 5-day forecast
    const getForecast = async (lat, lon) => {
        try {
            const response = await fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
            if (!response.ok) throw new Error('Forecast data not available');
            const data = await response.json();
            
            // Get one forecast per day (every 8th item as the API returns data every 3 hours)
            const dailyForecasts = data.list.filter((item, index) => index % 8 === 0);
            
            forecastContainer.innerHTML = dailyForecasts.map(forecast => `
                <div class="forecast-item">
                    <div class="forecast-date">${formatDate(forecast.dt)}</div>
                    <div class="forecast-icon">
                        <i class="fas fa-${getWeatherIcon(forecast.weather[0].icon)}"></i>
                    </div>
                    <div class="forecast-temp">${kelvinToCelsius(forecast.main.temp)}°C</div>
                    <div class="forecast-desc">${forecast.weather[0].description}</div>
                </div>
            `).join('');
        } catch (error) {
            throw error;
        }
    };

    // Function to handle weather search
    const handleWeatherSearch = async () => {
        const city = locationInput.value.trim();
        if (!city) return;

        try {
            const coords = await getCurrentWeather(city);
            await getForecast(coords.lat, coords.lon);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    // Event listeners
    searchButton.addEventListener('click', handleWeatherSearch);
    locationInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleWeatherSearch();
    });

    // Get weather for default location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const response = await fetch(
                    `${BASE_URL}/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}`
                );
                const data = await response.json();
                locationInput.value = data.name;
                handleWeatherSearch();
            } catch (error) {
                console.error('Error getting default location weather:', error);
            }
        });
    }
}); 