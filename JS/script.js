const SButton = document.querySelector('.SButton');
const enterCity = document.querySelector('.enterCity');
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

        console.log(fiveDaysForcast)

    }).catch(() => {
        alert('some error occure while fetching weather forcast ');
    });
}

SButton.addEventListener('click', getData);

