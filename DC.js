const display = document.getElementById('clock');
const full_h = document.getElementById('24h');
const half_h = document.getElementById('12h');
let running = true;
let full;
let half;

function time_24h (){
    if(running){
        clearInterval(half);
        let date = new Date();
        
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        display.innerHTML = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

full = setInterval(time_24h, 1000);

full_h.onclick = () => {
    running = true;
    full = setInterval(time_24h, 1000);
}

half_h.onclick = () => {
    running = false;
    function time_12h () {
        if(!running){
            let date = new Date();
            display.innerHTML = date.toLocaleTimeString();
            clearInterval(full);
        }
    }
    half = setInterval(time_12h, 1000);
}

function displaydate () {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let n;
    let date = new Date();
    let day = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();
    let day_name = days[date.getDay()];
    
    if(day == 1){
        n = 'st';
    } else if (day == 2){
        n = 'nd';
    } else if (day == 3){
        n = 'rd';
    } else {
        n = 'th';
    }

    full_date = `${day_name}, ${day}<sup style = "font-size: clamp(1rem, 1.5rem, 2rem)">${n}</sup> ${month}, ${year}`;
    document.getElementById('date').innerHTML = full_date;
}

setInterval(displaydate(), 600000);

function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve(position); // Resolve with the position object
                    getWeather(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    reject(error); // Reject with the error object
                }
            );
        } else {
            reject("Geolocation is not supported by this browser.");
        }
    });
}

async function getWeather(lat, lon) {
    try {
        const apiKey = '32146c854c8a86ed7b0c89bcaa305056';

        document.getElementById('weather-container').classList.toggle('search-animation-close');
        document.getElementById('Btn_section').style.display = 'none';
        
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await fetch(apiUrl);
        const weatherData = await response.json();
        // console.log(weatherData);
        return displayWeather(weatherData);
    } catch (error) {
        displayError(error);
    }
}

async function getCities(city) {
    const apiKey = '32146c854c8a86ed7b0c89bcaa305056';
    const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        // throw new Error('Failed to fetch cities');
        displayError('Failed to fetch cities');
    }
    const citiesData = await response.json();
    // console.log(citiesData);
    return displayCities(citiesData);
}
// getCities('melbourne');

async function displayCities(cities) {
    const citiesList = document.getElementById('cities-list');
    let cities_list = [];
    // const {cod: status} = cities;
    class City {
        constructor(name, state, country, lat, lon){
            this.name = name;
            this.state = state;
            this.country = country;
            this.lat = lat;
            this.lon = lon;
        }
    }

    for(let i = 0; i < cities.length; i++){
        cities_list.push(new City(cities[i].name, cities[i].state, cities[i].country, cities[i].lat, cities[i].lon));
    }

    // console.log(cities_list);
    
    for (const city of cities_list) {
        const cityItem = document.createElement('ul');
        if(city.state == undefined){
            cityItem.textContent = `${city.name}, ${city.country}`;
        } else {
            cityItem.textContent = `${city.name}, ${city.state}, ${city.country}`;
        }
        cityItem.addEventListener('click', async () => {
            document.getElementById('citiesList').classList.toggle('search-animation-close');
            document.getElementById('citiesList').classList.toggle('bounce');
            setTimeout(() => {document.getElementById('citiesList').classList.toggle('search-animation-close')}, 500)
            setTimeout(() => {document.getElementById('citiesList').classList.toggle('bounce')}, 500)
            setTimeout(() => {document.getElementById('citiesList').style.display = 'none'}, 500);
            setTimeout(() => {getWeather(city.lat, city.lon)}, 700)
        });
        document.getElementById('citiesList').appendChild(cityItem);
    }
}
// const geolocationTrackingAPI = 'http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}'


async function getWeatherByCity(city) {
    const apiKey = '32146c854c8a86ed7b0c89bcaa305056';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    document.getElementById('weather-container').classList.toggle('search-animation-close');
    document.getElementById('Btn_section').style.display = 'none';
    // if(document.getElementById('weather-container').classList.contains('jiggle')){document.getElementById('weather-container').classList.remove('jiggle');}

    const response = await fetch(apiUrl)
    const weatherData = await response.json();
    return displayWeather(weatherData);
}

document.getElementById('search-button').addEventListener('click', (event) => {
    event.preventDefault();
    if(document.getElementById('city-input').style.display == 'none'){
        document.getElementById('city-input').style.display = 'block';
        // console.log(document.getElementById('city-input').style.display);
    } else {
        if(document.getElementById('city-input').value == ''){
            alert('Please enter a city name');
        } else  {
            const city = document.getElementById('city-input').value;
            getWeatherByCity(city);
        }
    } 
});

document.getElementById('city-input').addEventListener('keydown', async (event) => {
    let keyboardChars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let keyboardCharsUpper = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    // console.log(event);
    
    if (event.key == ' ') {
        // event.preventDefault();
        document.getElementById('citiesList').innerHTML = '';
        document.getElementById('citiesList').classList.toggle('search-animation-open');
        document.getElementById('citiesList').style.display = 'none';
        await getCities(document.getElementById('city-input').value);
        document.getElementById('citiesList').style.display = 'flex';
        setTimeout(() => {document.getElementById('citiesList').classList.toggle('search-animation-open')}, 500);
        setTimeout(() => {document.getElementById('citiesList').classList.toggle('bounce-reverse')}, 0);
        setTimeout(() => {document.getElementById('citiesList').classList.toggle('bounce-reverse')}, 500);
    }

    if (event.key === 'Enter') {
        if(document.getElementById('city-input').value == ''){
            alert('Please enter a city name');
        } else  {
            const city = document.getElementById('city-input').value;
            getWeatherByCity(city);
        }
    }
});

document.getElementById('city-input').addEventListener('click', (event) => {
    document.getElementById('weather-container').classList.toggle('bounce');
    setTimeout(() => {
        document.getElementById('weather-container').classList.toggle('bounce');
    }, 500);
    // console.log('clicked');
    
});

document.getElementById('get-location-button').addEventListener('click', async (event) => {
    event.preventDefault();
    await getLocation();
    document.getElementById('city-input').style.display = 'none';
});


document.addEventListener('DOMContentLoaded', () => {
    setInterval(getLocation()
    .catch((error) => {
        displayError(error);
    })
    , 900000)
});

function toggleClass () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            document.getElementById('weather-container').classList.toggle('search-animation-close');
            resolve(true);
        }, 500);
    }
)}

async function displayWeather(weatherData) {
    const weatherContainer = document.getElementById('weather-container');
    const weatherDescription = document.getElementById('weather-description');
    const weatherTemperature = document.getElementById('temperature');

    const {
        name: city,
        cod: number,
        weather: [{description, id}],
        sys: {country, sunset, sunrise},
        main: {temp, feels_like},
    } = weatherData

    // console.log(number);
    
    let anim = await toggleClass();
    if(anim){
        document.getElementById('city').textContent = `${city}, ${country}`;
        weatherDescription.textContent = `Feels like ${(feels_like - 273.15).toFixed(0)}°C, ${description}`;
        weatherTemperature.textContent = `${getEmoji(id, sunset, sunrise)} ${(temp - 273.15).toFixed(0)}°C`;
        
        document.getElementById('weather-container').classList.toggle('search-animation-open')
        setTimeout(() => {document.getElementById('weather-container').classList.toggle('search-animation-open')}, 500)
        setTimeout(() => {document.getElementById('weather-container').classList.toggle('jiggle')}, 1000)
        setTimeout(() => {document.getElementById('weather-container').classList.toggle('jiggle')}, 1500)
        weatherContainer.style.display = 'flex';
        document.getElementById('Btn_section').style.display = 'flex';
    }
    // if(number == '400'){
    //     console.log(cod);
        
    //     displayError('City not found');
    //     return;
    // }
}

function getEmoji (id, sunset, sunrise) {
    let emoji;
    if(id >= 200 && id <= 232){
        emoji = '🌩️';
    } else if (id >= 300 && id <= 321){
        emoji = '🌧️';
    } else if (id >= 500 && id <= 531){
        emoji = '🌧️';
    } else if (id >= 600 && id <= 622){
        emoji = '🌨️';
    } else if (id >= 701 && id <= 781){
        emoji = '🌫️';
    } else if (id == 800){
        let date = (Date.now() / 1000).toFixed(0);
        if(date > sunset || sunrise > date){
            emoji = '🌙';
        } else {
            emoji = '☀️';
        }
    } else if (id >= 801 && id <= 804){
        emoji = '☁️';
    } else {
        emoji = '🌤️';
    }
    return emoji;
}

function displayError(error) {
    const errorDisplay = document.getElementById('errorDisplay');
    errorDisplay.textContent = `Error: ${error}`;
}

// setInterval(() => {console.log((Date.now()/1000).toFixed(0))}, 1000);