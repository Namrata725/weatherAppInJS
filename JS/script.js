const SButton = document.querySelector('.SButton');
const enterCity = document.querySelector('.enterCity');
const API_KEY = "c52ee3c2d437912f3efe2d6e6414d742";



const getData = () => {
    const cityName = enterCity.value.trim(); //remove extra space from city name
    if (!cityName) return;

    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    //get enter langitude/ latitude/ and name from api responce 
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        
        console.log(data)
        
    }).catch(() => {
        alert('some error occure');
    });
}

SButton.addEventListener('click', getData);

