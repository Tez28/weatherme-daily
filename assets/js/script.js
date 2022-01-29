//insert variables
var city = "Virgina"
var key = "a3a0bcd52adc4815756e62e0c6d7f4e1"
var cityListEl = $('.cityList');
var theWeather = [];

// defines date and time
var date = moment().format('MMMM Do YYYY, h:mm:ss a');

var cityList = [];
// locall storage for cityList on search click
$('.search').on("click", function (event) {
    event.preventDefault();
    city = $('.textIn').val();
    if (city === "") {
        return;
    };
    console.log(city);
    cityList.push(city);
    localStorage.setItem('city', JSON.stringify(cityList));
    localStorage.getItem('city'); 
    weekForecastEl.empty();
    getHist();
    getWeather();
});

// generate search buttons
function getHist() {
        var rowEl = $('<row>');
        var btnEl = $('<button>').text(city);
        rowEl.addClass('row cityBtn');
        btnEl.addClass('btn btnCity');
        btnEl.attr('type', 'button');

        cityListEl.prepend(rowEl);
        rowEl.append(btnEl);
       if (!city) {
        return;
    }
    $('.btnCity').on("click", function (event) {
        event.preventDefault();
        city = $(this).text();
        weekForecastEl.empty();
        getWeather();
    });
};
// generate todays weather
var cardToday = $('.cardToday');
// pull weather from api
function getWeather() {
    var currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;
    $(cardToday).empty();

    $.ajax({
        url: currentUrl,
        method: 'GET',
    }).then(function (response){
      console.log(response)
        $('.cardCity').text(response.name);
        $('.cardDate').text(date);
        var feelEl = $('<p>').text(`Feels Like: ${response.main.feels_like} °F`);
        cardToday.append(feelEl);
        var tempEl = $('<p>').text(`Temperature is: ${response.main.temp} °F`);
        cardToday.append(tempEl);
        var humidityEl = $('<p>').text(`Himidity is: ${response.main.temp} %`);
        cardToday.append(humidityEl);
        var windSpeed = $('<p>').text(`Wind Speed is: ${response.main.temp} mph`);
        cardToday.append(windSpeed);
        console.log(response.coord)

        var latiCity = response.coord.lat;
        var longCity = response.coord.lon;

        var getUvi = `https://api.openweathermap.org/data/2.5/onecall?lat=${latiCity}&lon=${longCity}&exclude=hourly,daily,minutely&appid=${key}`;

        $.ajax({
            url: getUvi,
            method: 'GET',
        }).then(function (response) {
          console.log(response)
            var uvi = response.current.uvi;
            var uviEl = $('<p>').text(`UVI: `);
            var spanUvi = $('<span>').text(uvi);
            uviEl.append(spanUvi);
            // uvi color chart from google
            if (uvi >= 0 && uvi <= 2) {
                spanUvi.attr("class", "green");
            } else if (uvi > 2 && uvi <= 5) {
                spanUvi.attr("class", "yellow");
            } else if (uvi > 5 && uvi <= 7) {
                spanUvi.attr("class", "orange");
            } else if (uvi > 7 && uvi <= 10) {
                spanUvi.attr("class", 'red');
            } else {
                spanUvi.attr("class", 'purple');
            }
        });
    });
    getForecastFive();
};
// generate 5 day forecast

var weekForecastEl = $('.weekForecast');
function getForecastFive() {
    var getFiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&units=imperial`;
    $.ajax({
        url: getFiveDay,
        method: 'GET',
    }).then(function (response) {
      console.log(response)
    // populate cards 
    for (let i = 0; i < 5; i++) {
      var fiveCardEl = $('<div>');
      fiveCardEl.attr('class', 'card text=white bg-primary mb-3 cardOne');
      fiveCardEl.attr('style', 'max-width: 175px;');
      weekForecastEl.append(fiveCardEl);

      var fiveCardHeader = $('<div>');
      fiveCardHeader.attr('class', 'card-header');
      var time = moment(response.list[i].dt_txt).format('YYYY-MM-DD');
      fiveCardHeader.text(time);
      fiveCardEl.append(fiveCardHeader);

      var cardBody = $('<div>');
      cardBody.attr('class', 'card-body');
      fiveCardEl.append(cardBody);

      var iconEl = $('<img>');
      iconEl.attr('class', 'icon');
      iconEl.attr('src', `https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}.png`);
      cardBody.append(iconEl);
    

      var cardTemp = $('<p>').text(`Temperature: ${response.list[i].main.temp} °F`);
      cardBody.append(cardTemp);
      
      var cardFeel = $('<p>').text(`Feels Like: ${response.list[i].main.feels_like} °F`);
      cardBody.append(cardFeel);
      
      var cardHumidity = $('<p>').text(`Humidity: ${response.list[i].main.humidity} %`);
      cardBody.append(cardHumidity);
    }
  });
};