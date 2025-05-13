const SButton = document.querySelector('.SButton');
const enterCity = document.querySelector('.enterCity');
const weatherCardsDiv = document.querySelector('.weatherCards');
const currentDiv = document.querySelector('.left');
const LButton = document.querySelector('.LButton');
const API_KEY = "c52ee3c2d437912f3efe2d6e6414d742";



const getData = () => {
    const cityName = enterCity.value.trim(); //remove extra space from city name
    if (!cityName) {
        alert('Please enter a city name');
        return;
    }

    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    //get enter langitude/ latitude/ and name from api responce 
    fetch(GEOCODING_API_URL)
        .then(res => res.json())
        .then(data => {

            if (!data.length) {
                alert(`No coordinates found for ${cityName}`);
                return;
            }

            const { name, lat, lon } = data[0];
            getWeatherDetails(name, lat, lon);
        })
        .catch(() => {
            alert('Some error occurred');
        });
}

//getting weather details from API

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {

        //filter only 1 forecast to get one forcast per day
        const uniqueForcastDays = [];
        const fiveDaysForcast = data.list.filter(forcast => {
            const forcastDate = new Date(forcast.dt_txt).getDate();
            if (!uniqueForcastDays.includes(forcastDate)) {
                return uniqueForcastDays.push(forcastDate)
            }
        });

        //clearing data after added new one

        enterCity.value = "";
        weatherCardsDiv.innerHTML = "";
        currentDiv.innerHTML = "";

        
        fiveDaysForcast.forEach((weatherItem, index) => {

            if (index === 0) {
                currentDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
            else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
        });
    }).catch(() => {
        alert('some error occure while fetching weather forcast ');
    });
}

const createWeatherCard = (cityName, weatherItem, index) => {
    if (index === 0) {
        return `
        <div class="details">
                <h2>${cityName} <br>(${weatherItem.dt_txt.split(" ")[0]})</h2>
                <h4>Temperature: <br> <span>${(weatherItem.main.temp - 273.15).toFixed(2)}</span></h4>
                <h4>Wind: <br> <span> ${weatherItem.wind.speed} M/s</span></h4>
                <h4>Humidity: <br><span> ${weatherItem.main.humidity}%</span></h4>
            </div>

            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="Weather Icon">
                <h4>${weatherItem.weather[0].description}</h4>
            </div>
        `;
    }
    else {
        return `  <li class="card">
                        <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="Weather Icon">
                        <h4>${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                        <h4>${weatherItem.wind.speed}M/s</h4>
                        <h4>${weatherItem.main.humidity}%</h4>
                    </li>`;
    }
}

const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                if (!data.length) return alert(`No coordinated found for ${cityName}`);
                const { name, lat, lon } = data[0];
                getWeatherDetails(name, latitude, longitude);


            }).catch(() => {
                alert('some error occure white fetching city');
            });

        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert('Geolocation permission denied, Try again!!!');
            }
        }

    );
}

SButton.addEventListener('click', getData);
LButton.addEventListener('click', getUserLocation);

