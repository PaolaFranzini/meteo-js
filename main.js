let myApiKey = '0839ff69e6bf3e71fbc91550342cb460';

let daysDisplayed = [];
let weatherOnDate = [];

let body = document.querySelector('body');
let mainTitle = document.querySelector('#main-title');
let introText = document.querySelector('#intro-text');
let searchField = document.querySelector('#search-field');
let searchButton = document.querySelector('#search-button');
let searchContainer = document.querySelector('#search-container');
let cityName = document.querySelector('#city-name');
let country = document.querySelector('#country');
let daySelection = document.querySelector('#day-selection');
let forecastContainer = document.querySelector('#forecast-container');

searchField.focus();
searchButton.addEventListener('click', searchTerm);

searchField.addEventListener('keyup', function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    searchButton.click();
    searchField.blur();
  }
});

function searchTerm() {
  let cityToSearch = document.querySelector('#search-field').value;
  if (cityToSearch) {
    searchWeather(cityToSearch);
  }
  document.querySelector('#search-field').value = '';
}

function searchWeather(searchCity) {
  if (introText.childNodes[1] === mainTitle) {
    introText.removeChild(mainTitle);
  }

  let url =
    'https://api.openweathermap.org/data/2.5/forecast?q=' +
    searchCity +
    '&lang=it&units=metric&APPID=' +
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
      body.classList.remove('weather-displayed');
      searchButton.blur();

      let searchErrorContainer = document.createElement('div');
      searchErrorContainer.setAttribute('id', 'search-error');
      searchContainer.appendChild(searchErrorContainer);

      let notFound = document.createElement('p');
      searchErrorContainer.appendChild(notFound);
      let myNotFound = document.createTextNode(
        `Non ho trovato la città "${searchCity}".`
      );
      notFound.appendChild(myNotFound);

      let checkSpelling = document.createElement('p');
      searchErrorContainer.appendChild(checkSpelling);
      let myCheck = document.createTextNode(
        'Per favore, controlla di aver scritto correttamente e fai una nuova ricerca'
      );
      checkSpelling.appendChild(myCheck);
    });
}

function initializeAll(resultFromServer) {
  console.log(resultFromServer);

  body.classList.add('weather-displayed');
  weatherOnDate = [];

  let searchError = document.querySelector('#search-error');
  if (searchError) {
    searchContainer.removeChild(searchError);
  }

  daySelection.innerHTML = '';
  forecastContainer.innerHTML = '';
  cityName.textContent = '';
  country.textContent = '';

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
    let newDay = document.createElement('a');
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
      return 'Dom';
    case 1:
      return 'Lun';
    case 2:
      return 'Mar';
    case 3:
      return 'Mer';
    case 4:
      return 'Gio';
    case 5:
      return 'Ven';
    case 6:
      return 'Sab';
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

  let titleRow = document.createElement('div');
  titleRow.setAttribute('class', 'title-row');
  forecastContainer.appendChild(titleRow);

  let timeTitle = document.createElement('p');
  timeTitle.setAttribute('class', 'title-detail time-title');
  titleRow.appendChild(timeTitle);
  let myTitleTime = document.createTextNode('');
  timeTitle.appendChild(myTitleTime);

  let descTitle = document.createElement('p');
  descTitle.setAttribute('class', 'title-detail desc-title');
  titleRow.appendChild(descTitle);
  let myTitleDesc = document.createTextNode('');
  descTitle.appendChild(myTitleDesc);

  let tempTitle = document.createElement('p');
  tempTitle.setAttribute('class', 'title-detail temp-title');
  titleRow.appendChild(tempTitle);
  let myTitleTemp = document.createTextNode('°C');
  tempTitle.appendChild(myTitleTemp);

  let ventoTitle = document.createElement('div');
  ventoTitle.setAttribute('class', 'title-detail vento-title');
  titleRow.appendChild(ventoTitle);

  let ventoWord = document.createElement('p');
  ventoWord.setAttribute('class', 'vento-sub vento-word');
  ventoTitle.appendChild(ventoWord);
  let myWordVento = document.createTextNode('Vento');
  ventoWord.appendChild(myWordVento);

  let ventoUnit = document.createElement('p');
  ventoUnit.setAttribute('class', 'vento-sub vento-unit');
  ventoTitle.appendChild(ventoUnit);
  let myUnitVento = document.createTextNode('m/s');
  ventoUnit.appendChild(myUnitVento);

  let umidTitle = document.createElement('p');
  umidTitle.setAttribute('class', 'title-detail umid-title');
  titleRow.appendChild(umidTitle);
  let myTitleUmid = document.createTextNode('Umid.');
  umidTitle.appendChild(myTitleUmid);

  for (i = 0; i < weatherOnDate[0].length; i++) {
    let hourRow = document.createElement('div');
    hourRow.setAttribute('class', 'hour-row');
    forecastContainer.appendChild(hourRow);

    let time = document.createElement('p');
    time.setAttribute('class', 'weather-detail time');
    hourRow.appendChild(time);
    let myTime = document.createTextNode(
      weatherOnDate[0][i].dt_txt.slice(11, 16)
    );
    time.appendChild(myTime);

    let descriptionContainer = document.createElement('div');
    descriptionContainer.setAttribute(
      'class',
      'weather-detail description-container'
    );
    hourRow.appendChild(descriptionContainer);

    let icon = document.createElement('img');
    icon.setAttribute('class', 'icon');
    icon.src =
      'http://openweathermap.org/img/wn/' +
      weatherOnDate[0][i].weather[0].icon +
      '@2x.png';
    descriptionContainer.appendChild(icon);

    let description = document.createElement('p');
    description.setAttribute('class', 'description');
    descriptionContainer.appendChild(description);
    let myDescription = document.createTextNode(
      weatherOnDate[0][i].weather[0].description
    );
    description.appendChild(myDescription);

    let temperature = document.createElement('p');
    temperature.setAttribute('class', 'weather-detail temperature');
    hourRow.appendChild(temperature);
    let myTemperature = document.createTextNode(
      Number(weatherOnDate[0][i].main.temp).toFixed(1) + '°'
    );
    temperature.appendChild(myTemperature);

    let wind = document.createElement('p');
    wind.setAttribute('class', 'weather-detail wind');
    hourRow.appendChild(wind);
    let myWind = document.createTextNode(weatherOnDate[0][i].wind.speed);
    wind.appendChild(myWind);

    let humidity = document.createElement('p');
    humidity.setAttribute('class', 'weather-detail humidity');
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
  let numChild = childrenForecastContainer.length;

  for (i = 0; i < numChild; i++) {
    forecastContainer.removeChild(childrenForecastContainer[0]);
  }

  let titleRow = document.createElement('div');
  titleRow.setAttribute('class', 'title-row');
  forecastContainer.appendChild(titleRow);

  let timeTitle = document.createElement('p');
  timeTitle.setAttribute('class', 'title-detail time-title');
  titleRow.appendChild(timeTitle);
  let myTitleTime = document.createTextNode('');
  timeTitle.appendChild(myTitleTime);

  let descTitle = document.createElement('p');
  descTitle.setAttribute('class', 'title-detail desc-title');
  titleRow.appendChild(descTitle);
  let myTitleDesc = document.createTextNode('');
  descTitle.appendChild(myTitleDesc);

  let tempTitle = document.createElement('p');
  tempTitle.setAttribute('class', 'title-detail temp-title');
  titleRow.appendChild(tempTitle);
  let myTitleTemp = document.createTextNode('°C');
  tempTitle.appendChild(myTitleTemp);

  let ventoTitle = document.createElement('div');
  ventoTitle.setAttribute('class', 'title-detail vento-title');
  titleRow.appendChild(ventoTitle);

  let ventoWord = document.createElement('p');
  ventoWord.setAttribute('class', 'vento-sub vento-word');
  ventoTitle.appendChild(ventoWord);
  let myWordVento = document.createTextNode('Vento');
  ventoWord.appendChild(myWordVento);

  let ventoUnit = document.createElement('p');
  ventoUnit.setAttribute('class', 'vento-sub vento-unit');
  ventoTitle.appendChild(ventoUnit);
  let myUnitVento = document.createTextNode('m/s');
  ventoUnit.appendChild(myUnitVento);

  let umidTitle = document.createElement('p');
  umidTitle.setAttribute('class', 'title-detail umid-title');
  titleRow.appendChild(umidTitle);
  let myTitleUmid = document.createTextNode('Umid.');
  umidTitle.appendChild(myTitleUmid);

  for (i = 0; i < weatherOnDate[index].length; i++) {
    let hourRow = document.createElement('div');
    hourRow.setAttribute('class', 'hour-row');
    forecastContainer.appendChild(hourRow);

    let time = document.createElement('p');
    time.setAttribute('class', 'weather-detail time');
    hourRow.appendChild(time);
    let myTime = document.createTextNode(
      weatherOnDate[index][i].dt_txt.slice(11, 16)
    );
    time.appendChild(myTime);

    let descriptionContainer = document.createElement('div');
    descriptionContainer.setAttribute(
      'class',
      'weather-detail description-container'
    );
    hourRow.appendChild(descriptionContainer);

    let icon = document.createElement('img');
    icon.setAttribute('class', 'icon');
    icon.src =
      'http://openweathermap.org/img/wn/' +
      weatherOnDate[index][i].weather[0].icon +
      '@2x.png';
    descriptionContainer.appendChild(icon);

    let description = document.createElement('p');
    description.setAttribute('class', 'description');
    descriptionContainer.appendChild(description);
    let myDescription = document.createTextNode(
      weatherOnDate[index][i].weather[0].description
    );
    description.appendChild(myDescription);

    let temperature = document.createElement('p');
    temperature.setAttribute('class', 'weather-detail temperature');
    hourRow.appendChild(temperature);
    let myTemperature = document.createTextNode(
      Number(weatherOnDate[index][i].main.temp).toFixed(1) + '°'
    );
    temperature.appendChild(myTemperature);

    let wind = document.createElement('p');
    wind.setAttribute('class', 'weather-detail wind');
    hourRow.appendChild(wind);
    let myWind = document.createTextNode(weatherOnDate[index][i].wind.speed);
    wind.appendChild(myWind);

    let humidity = document.createElement('p');
    humidity.setAttribute('class', 'weather-detail humidity');
    hourRow.appendChild(humidity);
    let myHumidity = document.createTextNode(
      weatherOnDate[index][i].main.humidity + '%'
    );
    humidity.appendChild(myHumidity);
  }
}
