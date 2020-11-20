function main() {

    const iconElement = document.querySelector(".weather-icon");
    const tableElement = document.querySelector(".flex-container");
    const tempElement = document.querySelector(".temperature-value p");
    const descElement = document.querySelector(".temperature-description p");
    const locationElement = document.querySelector(".location p");
    const notificationElement = document.querySelector(".notification");
    const tomorrowWeather = document.querySelector(".besok");
    const todayWeather = document.querySelector(".today");
    const lusaWeather = document.querySelector(".lusa");
    // const jamToday = document.querySelector(".hourly");
    const weather = {};
    document.getElementById("cariKota").addEventListener("search", getCityWeather);


    weather.temperature = {
        unit : "celsius"
    }

    const KELVIN = 273;
    const key = "76256b7de5c3b9c4936de1c80e2a054d";
    geoloc();
    function geoloc(){
        if('geolocation' in navigator){
            navigator.geolocation.getCurrentPosition(setPosition, showError);
        }else{
            notificationElement.style.display = "block";
            notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
        }
    }

    function setPosition(position){
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        
        getWeather(latitude, longitude);    }

    function showError(error){
        notificationElement.style.display = "block";
        notificationElement.innerHTML = `<p> ${error.message} </p>`;
    }

    function getWeather(latitude, longitude){
        let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&lang=id`;
        
        fetch(api)
            .then(function(response){
                let data = response.json();
                return data;
            })
            .then(function(data){
                weather.temperature.value = Math.floor(data.main.temp - KELVIN);
                weather.description = data.weather[0].description;
                weather.iconId = data.weather[0].icon;
                weather.city = data.name;
                weather.country = data.sys.country;
            })
            .then(function(){
                displayWeather();
                displayDailyWeather(latitude, longitude);
            });
    }
    function getCityWeather() { 
        const city = document.getElementById('cariKota').value.toLowerCase(); 
        
        fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`)
            .then(function(response){
                let data = response.json();
                return data;
            })
            .then(function(data){
               tableElement.innerHTML = "";
               getWeather(data.coord.lat, data.coord.lon);
               // jamToday.innerHTML = "";
            })
            .then(function(){
                displayWeather();
            });

    } 
    function displayDailyWeather(latitude, longitude){
        fetch(` https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current&appid=${key}`)
        .then(function(response){
                let data = response.json();
                return data;
            })
            .then(function(data){
                    for (var i = 0; i < 12; i++) {
                        let tanggal = new Date(data.hourly[i].dt*1000);
                        let hour = tanggal.getUTCHours().toString();
                        let min = tanggal.getUTCMinutes().toString();
                        if(tanggal.getUTCMinutes()<10){
                            min = "0" + tanggal.getUTCMinutes().toString();
                        }
                        if(tanggal.getUTCHours()<10){
                            hour = "0" + tanggal.getUTCHours().toString();
                        }
                    // jamToday.innerHTML +=
                    //           `${i}  ${hour}:${min}  ${data.hourly[i].temp}<img src="icons/${data.hourly[i].weather[0].icon}.png"/>`;
                    }
                    let tomorrow = data.daily[1];
                    let today = data.daily[0];
                    let lusa = data.daily[2];
                    let lusadate = new Date(data.daily[2].dt*1000);
                    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    for (var i = 1; i < (data.daily).length; i++) {
                        let date = new Date(data.daily[i].dt*1000);
                        let tggl = date.toString();
                    // tableElement.innerHTML +=
                    //       // `<div>
                    //       //     ${days[date.getDay()]}<br>
                    //       //     <img src="icons/${data.daily[i].weather[0].icon}.png" width="70px"/><br>
                    //       //     ${data.daily[i].weather[0].description}
                    //       // <div>`;

                    }
                    if(screen.width<=700){
                    tableElement.innerHTML +=
                         `<div>
                              <table>
                              <tr>
                              <td width="85px">Hari ini</td>
                              <td><img src="icons/${weather.iconId}.png" width="30px"/>
                              ${weather.temperature.value} °<span>C</span></td>
                              </tr>
                              </table>
                          </div>
                          <div>
                              <table>
                              <tr>
                              <td width="85px">Besok</td>
                              <td><img src="icons/${tomorrow.weather[0].icon}.png" width="30px"/>
                              ${Math.floor(tomorrow.temp.eve - KELVIN)} °<span>C</span></td>
                              </table>
                          </div>
                          <div>
                              <table>
                              <tr>
                              <td width="85px">
                              ${days[lusadate.getDay()]}</td>
                              <td><img src="icons/${lusa.weather[0].icon}.png" width="30px"/>
                              ${Math.floor(lusa.temp.eve - KELVIN)} °<span>C</span></td>
                              </table>
                          </div>
                          <div class="next">
                                <button type="button" class="btn btn-outline-primary">Primary</button>
                          </div>
                    `;
                }
                else {
                        tableElement.innerHTML +=
                         `<div>
                              Hari ini<br>
                              <img src="icons/${weather.iconId}.png" width="50px"/><br>
                              ${weather.temperature.value} °<span>C</span>
                          </div>
                          <div>
                              Besok<br>
                              <img src="icons/${tomorrow.weather[0].icon}.png" width="50px"/><br>
                              ${Math.floor(tomorrow.temp.eve - KELVIN)} °<span>C</span>
                          </div>
                          <div>
                              ${days[lusadate.getDay()]}<br>
                              <img src="icons/${lusa.weather[0].icon}.png" width="50px"/><br>
                              ${Math.floor(lusa.temp.eve - KELVIN)} °<span>C</span>
                          </div>
                          <div class="next">
                                <button type="button" class="btn btn-outline-primary">Primary</button>
                          </div>
                    `;
                }

            })
    }
    function displayWeather(){
        iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        descElement.innerHTML = weather.description;
        locationElement.innerHTML = `${weather.city}, ${weather.country}`;
        document.body.style.background = `no-repeat center/400% url("scenery/${weather.iconId}.jpg")`;
    }
    function celsiusToFahrenheit(temperature){
        return (temperature * 9/5) + 32;
    }
    tempElement.addEventListener("click", function(){
        if(weather.temperature.value === undefined) return;
        
        if(weather.temperature.unit == "celsius"){
            let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
            fahrenheit = Math.floor(fahrenheit);
            
            tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
            weather.temperature.unit = "fahrenheit";
        }else{
            tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
            weather.temperature.unit = "celsius"
        }
    });
}

export default main;
