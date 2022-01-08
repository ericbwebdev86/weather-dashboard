//GIVEN a weather dashboard with form inputs

//WHEN I search for a city
//THEN I am presented with current and future conditions for that city and that city is added to the search history

//WHEN I view current weather conditions for that city
//THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

//WHEN I view the UV index
//THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe

//WHEN I view future weather conditions for that city
//THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity

//WHEN I click on a city in the search history
//THEN I am again presented with current and future conditions for that city

let appID = "&appid=a1a6bda4ff081633f2f7eb1de4acaa4e";

let search = $("#searchBtn");
let index = 0;
let date = moment().get("date");
let currentDate = moment().format("MMMM Do YYYY");
let history = JSON.parse(localStorage.getItem("search")) || [];


function whatsTheWeather(city) {
    let weatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + appID + "&units=imperial";
    fetch(weatherURL).then(function (response) {
        response.json().then(data => {
            console.log(city);
            console.log(weatherURL);
            console.log(data);
            let todaysDate = new Date(data.dt * 1000)
            let currentDay = todaysDate.getDate();
            let currentMonth = todaysDate.getMonth();
            let currentYear = todaysDate.getFullYear();
            let weatherIcon = data.weather[0].icon;
            //build current day weather card
            $(".current-day").innerHTML = "";
            $(".city-date").innerHTML = "";
            $(".temp").innerHTML = "";
            $(".wind").innerHTML = "";
            $(".humidity").innerHTML = "";
            $(".weather-container").append("<div>").addClass("container col-md-12 card border-dark current-day");
            $(".current-day").append("<h2>").addClass("card-title city-date");
            $(".city-date").append(`${data.name} (${currentMonth + 1}/${currentDay}/${currentYear})`);
            console.log(weatherIcon);
            let makeImg = $('<img />', {
                src: `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
            });
            makeImg.appendTo($(".city-date"));
            $(".current-day").append("<p>").addClass("card-text temp");
            $(".temp").append(`Temp: ${data.main.temp} F`)
            $(".current-day").append("<p>").addClass("card-text wind");
            $(".wind").append(`Wind Speed: ${data.wind.speed} MPH`)
            $(".current-day").append("<p>").addClass("card-text humidity");
            $(".humidity").append(`Humidity: ${data.main.humidity} %`)
            let lat = data.coord.lat;
            let lon = data.coord.lon;
            let oneCallURL = "http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + appID;
            fetch(oneCallURL).then(function (responseOC) {
                responseOC.json().then(data => {
                    $(".current-day").append("<p>").addClass("card-text uv");
                    $("p.uv").append($(`<span class="btn btn-success">${data.current.uvi}</span>`))
                })
            })
            let cityName = data.name;
            let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + appID + "&units=imperial";
            fetch(forecastURL).then(function (responseFor) {
                responseFor.json().then(data => {

                    for (i = 0; i < $(".forecast-card").length; i++) {
                        $(".forecast-card")[i].innerHTML = "";
                        let forecastI = i * 8 + 4;
                        let fcDate = new Date(data.list[forecastI].dt * 1000);
                        let fcDay = fcDate.getDate();
                        let fcMonth = fcDate.getMonth();
                        let fcYear = fcDate.getFullYear();
                        console.log(data.list[forecastI].main.temp)
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
                        // $(".fc-city-date").append(`${data.city.name} (${fcMonth + 1}/${fcDay}/${fcYear})`);

                        makeFCImg.appendTo($(".forecast-card")[i]);
                        //.attr("src","https://openweathermap.org/img/wn/" + data.list[forecastI].weather[0].icon + "@2x.png");

                        makeTemp.appendTo($(".forecast-card")[i]);
                        // $(".fc-temp").append(`Temp: ${data.main.temp} F`);

                        makeWind.appendTo($(".forecast-card")[i]);
                        makeHumidity.appendTo($(".forecast-card")[i]);
                        // $(".fc-humidity").append(`Humidity: ${data.list.main.humidity} %`);
                    }
                })
            })

        })

    })
}

search.click(function () {
    event.preventDefault();
    let cityInput = $(".city").val().trim();
    whatsTheWeather(cityInput);
    history.push(cityInput);
    localStorage.setItem("search", JSON.stringify(history));
    recentCities();
})

function recentCities() {
    $(".history-div").innerHTML = "";
    for (let i = 0; i < history.length; i++) {
        let historyBtn = $("<button>", {
            class: "mt-2 mb-2 me-2 btn btn-secondary col-4 col-md-3 col-lg-2",
            text: `${history[i]}`,
            value: history[i]
        });
        historyBtn.click(function () {
            whatsTheWeather(historyBtn.val());
        })
        historyBtn.appendTo($(".history-div"));
    }
}
recentCities();



