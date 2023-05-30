const buscadorInput = document.querySelector('#buscador-input');
const containerPaises = document.querySelector('#container-paises');
let countries = '';

const getCountry = async () => {
  try {
    const responseAllCountry = await fetch('https://restcountries.com/v3.1/all');
    const dataAllCountry = await responseAllCountry.json();
    countries = dataAllCountry;
  } catch (error) {
    console.log(error);
  }
};

getCountry();

const getWeather = async (city) => {
  try {
    const apiKey = '8479647d35d02ea1d16ebf8346d2a321';
    const responseWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=es&appid=${apiKey}`);
    const dataWeather = await responseWeather.json();
    return dataWeather;
  } catch (error) {
    console.log(error);
  }
};

let timeoutId;

buscadorInput.addEventListener('input', () => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(async () => {
    const searchText = buscadorInput.value.toLowerCase().trim();

    const filtradoName = countries.filter((country) => country.name.common.toLowerCase().startsWith(searchText));

    containerPaises.innerHTML = '';

    if (filtradoName.length < 10) {
      if (filtradoName.length > 1) {
        filtradoName.forEach(function (country) {
          const pais = document.createElement('div');
          pais.classList.add('paises');

          const flagImg = document.createElement('img');
          flagImg.src = country.flags.png;

          pais.innerHTML = `
            <div class="flag-container"></div>
            <h3 class="name">${country.name.common}</h3>
          `;
          pais.querySelector('.flag-container').appendChild(flagImg);
          containerPaises.append(pais);
        });
      }

      if (filtradoName.length === 1) {
        filtradoName.forEach(async function (country) {
          const pais = document.createElement('div');
          pais.classList.add('paises');
          pais.classList.add('paises-1');

          const flagImg = document.createElement('img');
          flagImg.src = country.flags.png;

          const city = country.name.common;
          const weather = await getWeather(city);
         console.log(weather);
          pais.innerHTML = `
            <div class="flag-container flag-container-1"></div>
            <h3 class="name">${country.name.common}</h3>
            <p>${weather.weather[0].description}</p>
            <p>Humedad:${weather.main.humidity}</p>
            <h4 class="temp">Temp: ${weather.main.temp}°C</h4>
          `;
          pais.querySelector('.flag-container').appendChild(flagImg);
          containerPaises.append(pais);
        });
      }
    } else {
      containerPaises.innerHTML = `<p id="muchos-resultados">Hay demasiados resultados, sea más específico</p>`;
    }

    if (buscadorInput.value === '') {
      containerPaises.innerHTML = '';
    }

    if (filtradoName.length === 0) {
      containerPaises.innerHTML = `<p id="muchos-resultados">Por favor, indique un país válido</p>`;
    }
  }, 150) })