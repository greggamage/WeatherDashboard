// daily weather variable
let weather = {
  apiKey: "86296f2ec0b9ce69883449dd897f8071",
  getWeather: function (city) {
    fetch(
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&units=imperial&appid=" +
      this.apiKey
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => this.showWeather(data));
  },
  // displaying weather data and setting parameters
  showWeather: function (data) {

    const list = data.list;

    // clearing previous 5 day forecast
    document.getElementById('forecast').innerHTML = "";

    //  Current day
    document.getElementById("city").innerText = "Weather in " + data.city.name + " at time " + list[0].dt_txt.substring(0, 10);
    document.getElementById("icon").src = "https://openweathermap.org/img/wn/" + list[0].weather[0].icon + ".png";
    document.getElementById("description").innerText = list[0].weather[0].description;
    document.getElementById("temp").innerText = list[0].main.temp + "°F";
    document.getElementById("humidity").innerText = "Humidity: " + list[0].main.humidity + "%";
    document.getElementById("wind").innerText = "Wind speed: " + list[0].wind.speed + " mph";

    //  Next 5 days
    this.populate(list[7]);
    this.populate(list[15]);
    this.populate(list[23]);
    this.populate(list[31]);
    this.populate(list[39]);
  },

  // city being searched input
  search: function () {
    weather.getWeather(document.getElementById("search-bar").value);

    // call function to display city name
    this.updateList(document.getElementById("search-bar").value);
  },

  //  5-day forecast
  populate: function (data) {

    let mainDiv = document.createElement('div');
    mainDiv.classList.add('bg-primary', 'text-white', 'col-lg-2');
    mainDiv.innerHTML = `
    <h4>${data.dt_txt.substring(0, 10)}</h4>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="">
    <p>Temp: ${data.main.temp}</p>
    <p>Humidity: ${data.main.humidity}</p>
    `;

    document.getElementById('forecast').append(mainDiv);
  },

  // updates list to local storage (updates local storage)
  updateList: function (city) {

    if (!localStorage.list) {
      localStorage.list = "[]";
    }

    let alreadySearched = false;
    let list = JSON.parse(localStorage.list);

    for (let i = 0; i < list.length; i++) {
      if (list[i] === city) {
        alreadySearched = true;
      }
    }

    if (!alreadySearched) {
      list.push(city);
    }
    localStorage.list = JSON.stringify(list);

    this.displayList();
  },

  // displays list on screen pulling from local storage
  displayList: function () {

    document.getElementById('searchList').innerHTML = "";

    let list = JSON.parse(localStorage.list);
    for (let i = 0; i < list.length; i++) {
      let aLink = document.createElement('a');
      aLink.innerText = list[i];
      aLink.classList.add('list-group-item', 'list-group-item-action')
      document.getElementById('searchList').append(aLink);
      aLink.addEventListener("click", function () {
        document.getElementById('search-bar').value = this.innerText;
        weather.search();
      })
    }
  }
};

// calling function on click
document.getElementById("searchButton").addEventListener("click", function () {
  weather.search();
});

//  updates searchlist with the localStorage
weather.displayList();

