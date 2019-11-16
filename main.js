let myApiKey = '0839ff69e6bf3e71fbc91550342cb460';

document.querySelector('#search-field').focus();
document.querySelector('#search-button').addEventListener('click', searchTerm);

let daysDisplayed = [];
let weatherOnDate = [];

let searchContainer = document.querySelector('#search-container');
let cityName = document.querySelector('#city-name').textContent;
let country = document.querySelector('#country').textContent;
let daySelection = document.querySelector('#day-selection');
let forecastContainer = document.querySelector('#forecast-container');

function searchTerm() {
  let cityToSearch = document.querySelector('#search-field').value;
  if (cityToSearch) {
    searchWeather(cityToSearch);
  }
}

function searchWeather(searchCity) {
  let url =
    'https://api.openweathermap.org/data/2.5/forecast?q=' +
    searchCity +
    '&units=metric&APPID=' +
    myApiKey;
  console.log(url);
  fetch(url)
    .then(result => {
      return result.json();
    })
    .then(result => {
      initializeAll(result);
    })
    .catch(() => {
      let searchError = document.createElement('p');
      searchError.setAttribute('id', 'search-error');
      searchContainer.appendChild(searchError);
      let myError = document.createTextNode(
        `Result not found for "${searchCity}". Please check the spelling.`
      );
      searchError.appendChild(myError);
    });
}

function initializeAll(resultFromServer) {
  console.log(resultFromServer);

  weatherOnDate = [];

  let searchError = document.querySelector('#search-error');
  if (searchError) {
    searchContainer.removeChild(searchError);
  }

  daySelection.innerHTML = '';
  forecastContainer.innerHTML = '';

  displayInfoCity(resultFromServer.city);
  displayDays(resultFromServer.list);
  splitWeatherOnDate(resultFromServer.list);
  console.log(weatherOnDate);
  activateDate();
}

function displayInfoCity(city) {
  cityName.textContent = city.name;
  country.textContent = city.country;
}

function displayDays(list) {
  for (i = 0; i < list.length; i++) {
    let alreadyIn = false;
    for (j = 0; j < daysDisplayed.length; j++) {
      if (list[i].dt_txt.slice(0, 10) === daysDisplayed[j]) {
        alreadyIn = true;
      }
    }
    if (!alreadyIn) {
      daysDisplayed.push(list[i].dt_txt.slice(0, 10));
    }
  }

  for (i = 0; i < daysDisplayed.length; i++) {
    let newDay = document.createElement('div');
    newDay.setAttribute('class', 'days');

    let numberDate = document.createElement('p');
    numberDate.setAttribute('class', 'day-detail number');
    newDay.appendChild(numberDate);
    let myNumber = document.createTextNode(dateToNumber(daysDisplayed[i]));
    numberDate.appendChild(myNumber);

    let nameWeekDate = document.createElement('p');
    nameWeekDate.setAttribute('class', 'day-detail weekday');
    newDay.appendChild(nameWeekDate);
    let myDay = document.createTextNode(dateToWeekday(daysDisplayed[i]));
    nameWeekDate.appendChild(myDay);

    daySelection.appendChild(newDay);
  }
}

function dateToNumber(stringDate) {
  return stringDate.slice(8);
}

function dateToWeekday(stringDate) {
  let myDate = new Date(stringDate);

  switch (myDate.getDay()) {
    case 0:
      return 'Sun';
    case 1:
      return 'Mon';
    case 2:
      return 'Tue';
    case 3:
      return 'Wed';
    case 4:
      return 'Thu';
    case 5:
      return 'Fri';
    case 6:
      return 'Sat';
  }
}

function splitWeatherOnDate(list) {
  console.log(list);
  let arrayForToday = [];
  for (i = 0; i <= list.length; i++) {
    if (i === list.length) {
      weatherOnDate.push(arrayForToday);
    } else if (
      arrayForToday.length === 0 ||
      list[i].dt_txt.slice(0, 10) ===
        arrayForToday[arrayForToday.length - 1].dt_txt.slice(0, 10)
    ) {
      arrayForToday.push(list[i]);
    } else {
      weatherOnDate.push(arrayForToday);
      arrayForToday = [];
      arrayForToday.push(list[i]);
    }
  }
}

function activateDate() {
  let listDays = document.querySelectorAll('.days');
  for (i = 0; i < listDays.length; i++) {
    listDays[i].addEventListener('click', updateInfoDate);
  }
  initializeToday();
}

function initializeToday() {
  let listDays = document.querySelectorAll('.days');
  listDays[0].classList.add('active');

  let hourRow = document.createElement('div');
  hourRow.setAttribute('class', 'hour-row');
  forecastContainer.appendChild(hourRow);

  for (i = 0; i < weatherOnDate[0].length; i++) {
    let time = document.createElement('p');
    time.setAttribute('class', 'time');
    hourRow.appendChild(time);
    let myTime = document.createTextNode(
      weatherOnDate[0][i].dt_txt.slice(11, 16)
    );
    time.appendChild(myTime);

    let icon = document.createElement('p');
    icon.setAttribute('class', 'icon');
    hourRow.appendChild(icon);
    let myIcon = document.createTextNode(weatherOnDate[0][i].weather[0].icon);
    icon.appendChild(myIcon);

    let description = document.createElement('p');
    description.setAttribute('class', 'description');
    hourRow.appendChild(description);
    let myDescription = document.createTextNode(
      weatherOnDate[0][i].weather[0].description
    );
    description.appendChild(myDescription);

    let temperature = document.createElement('p');
    temperature.setAttribute('class', 'temperature');
    hourRow.appendChild(temperature);
    let myTemperature = document.createTextNode(
      Number(weatherOnDate[0][i].main.temp).toFixed(1) + '°'
    );
    temperature.appendChild(myTemperature);

    let wind = document.createElement('p');
    wind.setAttribute('class', 'wind');
    hourRow.appendChild(wind);
    let myWind = document.createTextNode(
      weatherOnDate[0][i].wind.speed + 'm/s'
    );
    wind.appendChild(myWind);

    let humidity = document.createElement('p');
    humidity.setAttribute('class', 'humidity');
    hourRow.appendChild(humidity);
    let myHumidity = document.createTextNode(
      weatherOnDate[0][i].main.humidity + '%'
    );
    humidity.appendChild(myHumidity);
  }
}

function updateInfoDate() {
  let number = this.childNodes[0].textContent;
  console.log(number);
  let index = 0;

  while (
    number !== daysDisplayed[index].slice(8) &&
    index < daysDisplayed.length
  ) {
    index++;
  }

  let listDays = document.querySelectorAll('.days');

  for (i = 0; i < listDays.length; i++) {
    listDays[i].classList.remove('active');
  }

  listDays[index].classList.add('active');

  let childrenForecastContainer = forecastContainer.childNodes;

  for (i = 0; i < childrenForecastContainer.length; i++) {
    forecastContainer.removeChild(childrenForecastContainer[i]);
  }

  let hourRow = document.createElement('div');
  hourRow.setAttribute('class', 'hour-row');
  forecastContainer.appendChild(hourRow);

  for (i = 0; i < weatherOnDate[index].length; i++) {
    let time = document.createElement('p');
    time.setAttribute('class', 'time');
    hourRow.appendChild(time);
    let myTime = document.createTextNode(
      weatherOnDate[index][i].dt_txt.slice(11, 16)
    );
    time.appendChild(myTime);

    let icon = document.createElement('p');
    icon.setAttribute('class', 'icon');
    hourRow.appendChild(icon);
    let myIcon = document.createTextNode(
      weatherOnDate[index][i].weather[0].icon
    );
    icon.appendChild(myIcon);

    let description = document.createElement('p');
    description.setAttribute('class', 'description');
    hourRow.appendChild(description);
    let myDescription = document.createTextNode(
      weatherOnDate[index][i].weather[0].description
    );
    description.appendChild(myDescription);

    let temperature = document.createElement('p');
    temperature.setAttribute('class', 'temperature');
    hourRow.appendChild(temperature);
    let myTemperature = document.createTextNode(
      Number(weatherOnDate[index][i].main.temp).toFixed(1) + '°'
    );
    temperature.appendChild(myTemperature);

    let wind = document.createElement('p');
    wind.setAttribute('class', 'wind');
    hourRow.appendChild(wind);
    let myWind = document.createTextNode(
      weatherOnDate[index][i].wind.speed + 'm/s'
    );
    wind.appendChild(myWind);

    let humidity = document.createElement('p');
    humidity.setAttribute('class', 'humidity');
    hourRow.appendChild(humidity);
    let myHumidity = document.createTextNode(
      weatherOnDate[index][i].main.humidity + '%'
    );
    humidity.appendChild(myHumidity);
  }
}
