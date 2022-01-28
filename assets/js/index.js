//insert variables
var city = "Virgina";
var key = "a3a0bcd52adc4815756e62e0c6d7f4e1"
var cityListEl = $('.cityList');

// defines date and time
var date = moment().format('MMMM Do YYYY, h:mm:ss a');

var cityList = [];
// locall storage for cityList on search click
$('.search').on("click", function (event) {
    event.preventDefault();
    city = $(this).parent('.btnCity').siblings('.textIn').val().trim();
    if (city === "") {
        return;
    };
    cityList.push(city);
    localStorage.setItem('city', JSON.stringify(cityList));
    foreCastEl.empty();
    getHist();
    getWeather();
});

// generate search buttons
function getHist() {
    cityListEl.empty();
    for (let i = 0; i < cityList.length; i++) {
        var rowEl = $('<row>');
        var btnEl = $('<button>').text(`${cityList.length[i]}`);
        rowEl.addClass('row cityBtn');
        btnEl.addClass('btn btnCity');
        btnEl.attr('type', 'button');

        cityListEl.prepend(rowEl);
        rowEl.append(btnEl);
    } if (!city) {
        return;
    }
    $('.btnCity').on("click", function (event) {
        event.preventDefault();
        city = $(this).text();
        foreCastEl.empty();
        getWeather();
    });
};
// generate todays weather
var cardToday = $('.cardToday');
// pull weather from api
function currentWeather() {
    var currentUrl = 'https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&&appid={key}';
    $(cardToday).empty();

    $ajax({
        url: currentUrl,
        method: 'GET',
    }).then(function (response){
        $('.cardCity').text(response.name);
        $('.cardDate').text(date);
        var feelEl = $('<p>').text('Feels Like: ${response.main.feels_like} °F');
        cardToday.append(feelEl);
        var tempEl = $('<p>').text('Temperature is: ${response.main.temp} °F');
        cardToday.append(tempEl);
        var humidityEl = $('<p>').text('Himidity is: ${response.main.temp} %');
        cardToday.append(humidityEl);
        var windSpeed = $('<p>').text('Wind Speed is: ${response.main.temp} mph');
        cardToday.append(windSpeed);

        var latiCity = response.coord.lat;
        var longCity = response.coord.long;

        var getUvi = `https://api.openweathermap.org/data/2.5/onecall?lat=${latiCity}&lon=${longCity}&exclude=hourly,daily,minutely&appid=${key}`;

        $.$ajax({
            url: getUvi
        })

    })
}
// generate buttons for searched cities