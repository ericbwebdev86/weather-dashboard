//GIVEN a weather dashboard with form inputs

let appID = "&appid=a1a6bda4ff081633f2f7eb1de4acaa4e";
let search = $("#searchBtn");
let index = 0;
let date = moment().get("date");
let currentDate = moment().format("MMMM Do YYYY");
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
let weatherContainer = $(".weather-container");

function whatsTheWeather(city) {
    //WHEN I search for a city
    //THEN I am presented with current and future conditions for that city and that city is added to the search history
    let weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + appID + "&units=imperial";
    fetch(weatherURL).then(function (response) {
        response.json().then(data => {
            let todaysDate = new Date(data.dt * 1000)
            let currentDay = todaysDate.getDate();
            let currentMonth = todaysDate.getMonth();
            let currentYear = todaysDate.getFullYear();
            let weatherIcon = data.weather[0].icon;
            //build current day weather card
            $(".weather-container").html("");
            let weatherDiv = $('<div>', {
                class: "container col-md-12 card border-dark current-day border-2"
            });
            let makeImg = $('<img />', {
                src: `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
            });
            let weatherH2 = $('<h2>', {
                class: "card-title city-date",
                text: `${data.name} (${currentMonth + 1}/${currentDay}/${currentYear})`
            });
            let weatherTemp = $('<p>', {
                class: "card-text",
                text: `Temp: ${data.main.temp} F`
            });
            let weatherWind = $('<p>', {
                class: "card-text",
                text: `Wind Speed: ${data.wind.speed} MPH`
            });
            let weatherHumidity = $('<p>', {
                class: "card-text",
                text: `Humidity: ${data.main.humidity} %`
            });
            //WHEN I view current weather conditions for that city
            //THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
            weatherDiv.appendTo($(".weather-container"));
            weatherH2.appendTo($(".current-day"));
            makeImg.appendTo($(".city-date"));
            weatherTemp.appendTo($(".current-day"));
            weatherWind.appendTo($(".current-day"));
            weatherHumidity.appendTo($(".current-day"));
            let lat = data.coord.lat;
            let lon = data.coord.lon;
            let oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + appID;
            fetch(oneCallURL).then(function (responseOC) {
                responseOC.json().then(data => {
                    console.log(data);
                    let currentUVI = data.current.uvi;
                    let uvBtn = $("<button>", {
                        class: "col-1 btn ",
                        text: `${currentUVI}`,
                        value: currentUVI
                    });
                    $(".current-day").append("<p>").addClass("card-text uv");
                    $(".uv").append("UV Index: ");
                    uvBtn.appendTo($(".uv"));
                    //WHEN I view the UV index
                    //THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
                    if (currentUVI < 3) {
                        uvBtn.addClass("btn-success mb-2");
                    } else if (currentUVI > 2 && currentUVI < 6) {
                        uvBtn.addClass("btn-warning mb-2");
                    } else {
                        uvBtn.addClass("btn-danger mb-2");
                    }
                })
            })
            let cityName = data.name;
            let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + appID + "&units=imperial";
            fetch(forecastURL).then(function (responseFor) {
                responseFor.json().then(data => {
                    //WHEN I view future weather conditions for that city
                    //THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
                    for (i = 0; i < $(".forecast-card").length; i++) {
                        $(".forecast-card")[i].innerHTML = "";
                        let forecastI = i * 8 + 4;
                        let fcDate = new Date(data.list[forecastI].dt * 1000);
                        let fcDay = fcDate.getDate();
                        let fcMonth = fcDate.getMonth();
                        let fcYear = fcDate.getFullYear();
                        let makeH4 = $("<h4>", {
                            class: "card-title fc-city-date fc-item",
                            text: `${data.city.name} (${fcMonth + 1}/${fcDay}/${fcYear})`
                        });
                        let makeFCImg = $('<img />', {
                            src: `https://openweathermap.org/img/wn/${data.list[forecastI].weather[0].icon}@2x.png`,
                            class: "fc-item"
                        });
                        let makeTemp = $("<p>", {
                            class: "card-text fc-temp fc-item",
                            text: `Temp: ${data.list[forecastI].main.temp} F`
                        });
                        let makeWind = $("<p>", {
                            class: "card-text fc-wind fc-item",
                            text: `Wind Speed: ${data.list[forecastI].wind.speed} MPH`
                        });
                        let makeHumidity = $("<p>", {
                            class: "card-text fc-humidity fc-item",
                            text: `Humidity: ${data.list[forecastI].main.humidity} %`
                        });
                        makeH4.appendTo($(".forecast-card")[i]);
                        makeFCImg.appendTo($(".forecast-card")[i]);
                        makeTemp.appendTo($(".forecast-card")[i]);
                        makeWind.appendTo($(".forecast-card")[i]);
                        makeHumidity.appendTo($(".forecast-card")[i]);
                    }
                })
            })

        })

    })
}
//search button
search.click(function () {
    event.preventDefault();
    //grab input
    let cityInput = $(".city").val().trim();
    //send input to weather function
    whatsTheWeather(cityInput);
    //send input to localstorage
    searchHistory.push(cityInput);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    recentCities();
})

function recentCities() {
    $(".history-div").html("");
    for (let i = 0; i < searchHistory.length; i++) {
        let historyBtn = $("<button>", {
            class: "mt-2 mb-2 me-2 btn btn-primary col-4 col-md-3 col-lg-2",
            text: `${searchHistory[i]}`,
            value: searchHistory[i]
        });
        //make history buttons clickable
        //WHEN I click on a city in the search history
        //THEN I am again presented with current and future conditions for that city
        historyBtn.click(function () {
            //history buttons send value as city to api weather call
            whatsTheWeather(historyBtn.val());
        })
        //add new history button to recent cities section
        historyBtn.appendTo($(".history-div"));
    }
}
recentCities();



