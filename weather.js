let city = localStorage.getItem("city");
let state = localStorage.getItem("state");
let lat;
let lon;
let width;
let val;
let unixT;
let curT;
let unixTArr = [];
let sevDayNames = [];
let zoom = 6;
let desktopSize = false;
let apiKeyOWM = '223038d0133a55f5d7ecd1ddaa9ea615';
let apiKeyWB = '7967810f24274d6e90166af4803705e6';
let countR = 0;


function weather() {
  let citySt = localStorage.getItem("citySt");
  $('#location').append(`<p id="location">${citySt}</p>`)
  $(latLon);
}
function latLon() {
	let url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state}&units=imperial&appid=${apiKeyOWM}`;
  fetch(url)
  .then(response => {
    if (response.ok) {
        return response.json();
      }
      throw new Error(response);
    })
  .then(responseJson => saveLatLon(responseJson))
  .catch(err => {
    console.log(err);
  });
}
function saveLatLon(responseJson) {
	lat = responseJson.coord.lat;
	lon = responseJson.coord.lon;
	findWidth();
}
function findWidth() {
	width = $(document).width();
	let newWidth = null;
	if(width < 700) {
		desktopSize = false;
		$('#buttons').append('<button id="current">Current Weather</button><button id="7Day">7 Day Forecast</button><button id="radar">Weather Radar</button><button id="16Day">16 day Forecast</button>');
		weatherSelect();
	}
	if(width >= 700) {
		desktopSize = true;
		$('#buttons').empty();
		$('body').append('<div id="desktopAll"></div><div id="sixtDayPage"></div>');
		desktopDisplay();
	}
	$(window).resize(function() {
		newWidth = $(document).width();
		if((width >= 700)&&(newWidth<700)) {
			findWidth();
		}
		else if((width < 700)&&(newWidth >= 700)) {
			findWidth();
		}
	});
}
function desktopDisplay() {
	$('#mobile').remove();
	$('#desktopAll').append('<section id="topRow"><div id="currentBox"><div id="currentBoxTop"></div><div id="currentBoxBottom"></div></div><div id="radarBox"><div id="map" class="map"></div><section id="radarControls"><div id="sliderBox"></div><div id="timeForward"></div><div id="zoomButtons"></div></section></div></section><section id="bottomRow"><div id="sevDayBox"></div><div id="sixtDayBox"><button id="sixtDayButton">Show more</button></div></section>');
	currentWeather();
	radarTimes();
	sevDay();
	$('#sixtDayButton').unbind().click(function() {
		$('#desktopAll').empty();
		sixtday();
	});
	
}
function weatherSelect() {
	$('#current').unbind().click(function() {
		emptyMobile();
		currentWeather();
	});
	$('#7Day').unbind().click(function() {
		emptyMobile();		
		sevDay();
	});
	$('#radar').unbind().click(function() {
		emptyMobile();
		radarTimes();
	});
	$('#16Day').unbind().click(function() {
		emptyMobile();		
		sixtday();
	});
}
function emptyMobile() {
	$('#radarControls').empty();
	$('#weatherData').empty();
	$('#map').empty();
}
function currentWeather() {
  url=`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKeyOWM}`;
	fetch(url)
  .then(response => {
    if (response.ok) {
        return response.json();
      }
      throw new Error(response);
    })
  .then(responseJson => displayCurrentWeather(responseJson))
  .catch(err => {
    console.log(err);
  });
}
function displayCurrentWeather(responseJson) {
	let desc = [];
	let icon = [];
	let imgUrl = [];
	let currentT = [];
	let feel = [];
	let hum = [];
	let wSpe = [];
	let wDir = [];
	let sliderHours = getSliderHours();
	console.log(sliderHours);
	for(i=0;i<19;i++) {
		desc[i] = responseJson.hourly[i].weather[0].description;
		icon[i] = convertIcon(responseJson.hourly[i].weather[0].icon);
		imgUrl[i] = (`https://www.weatherbit.io/static/img/icons/${icon[i]}.png`);
		currentT[i] = round(responseJson.hourly[i].temp);
		feel[i] = round(responseJson.hourly[i].feels_like);
		hum[i] = round(responseJson.hourly[i].humidity);
		wSpe[i] = round(responseJson.hourly[i].wind_speed);
		wDir[i] = windDirection(responseJson.hourly[i].wind_deg);
	}
	let curWeatherArr=[desc,imgUrl,currentT,feel,hum,wSpe,wDir];
	let a = 0;
	if(desktopSize == false) {
		$('#weatherData').append(`<section id="curMobBot"><div><h3>${currentT[a]}<sup>&#8457</sup></h3><h4>${desc[a]}</h4><p>Feels like ${feel[a]}<sup>&#176</sup><br>Humidity ${hum[a]}%<br>Wind ${wSpe[a]}mph ${wDir[a]}</p></div><div><img src="${imgUrl[a]}" alt="weather icon"></div></section><section id="curSliderBox"><input type="range" min="0" max="18" value="0" class="curSlider" id="curSlider"><div id="curSliderTicks"></div><div id="curSliderLabels"></div></section>`);
	}
	if(desktopSize == true) {
		$('#currentBoxTop').append(`<div><h1>${currentT[a]}<sup>&#8457</sup></h1><h3>${desc[a]}</h3><p>Feels like ${feel[a]}<sup>&#176</sup><br>Humidity ${hum[a]}%<br>Wind ${wSpe[a]}mph ${wDir[a]}</p></section></div><div id="curImgDeskDiv"><img src="${imgUrl[a]}" alt="weather icon"></div>`);
		$('#currentBoxBottom').append('<section id="curSliderBox"><input type="range" min="0" max="18" value="0" class="curSlider" id="curSlider"><div id="curSliderTicks"></div><div id="curSliderLabels"></div></section></div>')
	}
	$('#curSliderTicks').append('<p class="colorTick">|</p>');
	for(i=0;i<6;i++){
		$('#curSliderTicks').append('<p>|</p>');
		$('#curSliderTicks').append('<p>|</p>');
		$('#curSliderTicks').append('<p class="colorTick">|</p>');
	}
	for(i=0;i<7;i++) {
		$('#curSliderLabels').append(`<p>${sliderHours[i]}</p>`);
	}
	console.log(curWeatherArr);
	watchCurSlider(curWeatherArr);
}
function watchCurSlider(curWeatherArr) {
	let curSliderPos = 0;
	let slider = document.getElementById("curSlider");
	slider.oninput = function() {
		curSliderPos = document.getElementById("curSlider").value;
		console.log(curSliderPos);
		
		if(desktopSize == false) {
		$('#curMobBot').empty();
		$('#curMobBot').append(`<section id="curMobBot"><div><h3>${curWeatherArr[2][curSliderPos]}<sup>&#8457</sup></h3><h4>${curWeatherArr[0][curSliderPos]}</h4><p>Feels like ${curWeatherArr[3][curSliderPos]}<sup>&#176</sup><br>Humidity ${curWeatherArr[4][curSliderPos]}%<br>Wind ${curWeatherArr[5][curSliderPos]}mph ${curWeatherArr[6][curSliderPos]}</p></div><div><img src="${curWeatherArr[1][curSliderPos]}" alt="weather icon"></div></section>`);
		}
		if(desktopSize == true) {
			$('#currentBoxTop').empty();
			$('#currentBoxTop').append(`<div><h1>${curWeatherArr[2][curSliderPos]}<sup>&#8457</sup></h1><h3>${curWeatherArr[0][curSliderPos]}</h3><p>Feels like ${curWeatherArr[3][curSliderPos]}<sup>&#176</sup><br>Humidity ${curWeatherArr[4][curSliderPos]}%<br>Wind ${curWeatherArr[5][curSliderPos]}mph ${curWeatherArr[6][curSliderPos]}</p></section></div><div id="curImgDeskDiv"><img src="${curWeatherArr[1][curSliderPos]}" alt="weather icon"></div>`);
			
		}
	}
}
function getSliderHours() {
	let today = new Date();
	let curH = today.getHours();
	let nextH = [curH];
	let newH = [curH];
	if(newH[0] > 12) {
				newH[0] = newH[0] - 12;
				newH[0] = `${newH[0]}:00`;
	}
	for(i=1;i<7;i++){
		if(nextH[i-1] < 10) {
			nextH[i] = nextH[i-1] + 3;
		}
		else if(nextH[i-1] >= 10) {
			nextH[i] = nextH[i-1] + 3;
			if(nextH[i] > 12) {
				nextH[i] = nextH[i] -12;
			}
		}
		newH[i] = `${nextH[i]}:00`;
	}
	return newH;
}
function sevDay() {
	url=`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKeyOWM}`;
	fetch(url)
  .then(response => {
    if (response.ok) {
        return response.json();
      }
      throw new Error(response);
    })
  .then(responseJson => sevDayDisplay(responseJson))
  .catch(err => {
    console.log(err);
  });
}
function sevDayDisplay(responseJson) {
	console.log(responseJson);
	let icon = [];
	let desc = [];
	let imgUrl = [];
	let min = [];
	let max = [];
	let dayNames = weekDays();
	for(i=0;i<8;i++){
		icon[i] = convertIcon(responseJson.daily[i].weather[0].icon);
		desc[i] = responseJson.daily[i].weather[0].description;
		imgUrl[i] = `https://www.weatherbit.io/static/img/icons/${icon[i]}.png`
		min[i] = round(responseJson.daily[i].temp.min);
		max[i] = round(responseJson.daily[i].temp.max);
	}
	if(desktopSize == false) {
		$('#weatherData').append('<section id="sevDaySec"></section>');
		for(i=0;i<8;i++) {
			$('#sevDaySec').append(`<div><h4>${dayNames[i]}</h4><h5>${desc[i]}</h5><img src="${imgUrl[i]}" alt="weather icon"></img><p>${min[i]}<sup>&#176</sup>   ${max[i]}<sup>&#176</sup></p></div>`);
		}
	}
	if(desktopSize == true) {
		dayNames[0] = 'Today';
		dayNames[1] = 'Tommorow';
		for(i=0;i<8;i++) {
			$(`#sevDayBox`).append(`<div><h5>${dayNames[i]}</h5><h5>${desc[i]}</h5><img src="${imgUrl[i]}" alt="weather icon"></img><p>${min[i]}<sup>&#176</sup>   ${max[i]}<sup>&#176</sup></p></div>`);
		}
	}
}
function radarTimes() {
	let urlTime = 'https://api.rainviewer.com/public/maps.json';
	fetch(urlTime)
  .then(response => {
    if (response.ok) {
        return response.json();
      }
      throw new Error(response);
    })
  .then(responseJson => saveUnix(responseJson))
  .catch(err => {
    console.log(err);
  });
}
function saveUnix(responseJson) {
	unixTArr = responseJson;
	unixT = unixTArr[0];
	curT = getCurT();
	$('#radarControls').append('<div id="sliderBox"></div><div id="timeForward"></div><div id="zoomButtons"></div>');
	$('#sliderBox').append('<input type="range" min="0" max="12" value="0" class="slider" id="slider">');
	$('#timeForward').append(`<p>${curT[0]}:${curT[1]} ${curT[2]}</p>`);
	$('#zoomButtons').append('<button id="out">-</button><button id="in">+</button>');
	radar();
}
function getCurT() {
	let amPm;
	let today = new Date();
	let curH = today.getHours();
	if(curH >= 12) {
		amPm = 'PM';
		if(curH > 12) {
			curH = curH-12;
		}
	}
	else if(curH < 12) {
		amPm = 'AM';
	}
	let curM = today.getMinutes();
	if(curM >= 10) {
		curM = curM.toString().slice(0, 1);
		curM = parseInt(curM);
		curM = curM * 10;
	}
	else if(curM<10) {
		curM = '00';
	}
	return([curH,curM,amPm]);
}
function radar() {
	$('#map').append('<div id="legend"><span id="labelTop"><p id="light">Light</p><p id="heavy">Heavy</p></span><img src="https://raw.githubusercontent.com/willwalker753/API-capstone-MVP/master/rain-legend.png" alt="rain scale" id="rain"></img><img src="https://github.com/willwalker753/API-capstone-MVP/blob/master/snow-legend.png?raw=true" alt="snow scale" id="snow"></img></div>')
	let lonLat = [lon,lat];
	var map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat(lonLat),
      zoom: zoom
    })
  });	
	urlRadar=`https://tilecache.rainviewer.com/v2/radar/${unixT}/512/${zoom}/${lat}/${lon}/4/1_1.png`;
	$('#map').append(`<div id="radarOverlay"><img src="${urlRadar}" id="radarImg" alt="radar overlay"></img></div>`);
	radarInput();
}
function radarInput() {
	$('#in').unbind().click(function() {
		zoom++;
		$('#map').empty();
		radar();
	});
	$('#out').unbind().click(function() {
		zoom--;
		
		$('#map').empty();
		radar();
	});
	countR = document.getElementById("slider").value;
	slider.oninput = function() {	
	  val = document.getElementById("slider").value;
		unixT = unixTArr[val];
  	curTChange(val);
		$('#timeForward').empty();
		$('#timeForward').append(`<p>${curT[0]}:${curT[1]} ${curT[2]}</p>`);
		timeChangeRadar();
	}
}
function curTChange(sliderValue) {
	if(sliderValue>countR) {
		if((curT[1] >= 10)&&(curT[1] < 50)) {
			for(i=0;i<sliderValue;i++){
				if((countR<sliderValue)&&(curT[1] < 50)) {
					curT[1] = curT[1] + 10;
					countR++;
				}
			}
		}
		if((curT[1] == '00')&&(countR<sliderValue)) {
			curT[1] = 10;
			countR++;
		}
		if((curT[1] == 50)&&(countR<sliderValue)) {
			curT[1] = '00';
			if(curT[0] == 12){
				curT[0] = 1;
			}
			else {
				curT[0] = curT[0] + 1;
			}
			if((curT[0] == 12)&&(curT[2] == 'AM')){
				curT[2] = 'PM';
			}
			else if((curT[0] == 12)&&(curT[2] == 'PM')){
				curT[2] = 'AM';
			}
			countR++;
		}
		if((curT[1] >= 10)&&(curT[1] < 50)) {
			for(i=0;i<sliderValue;i++){
				if((countR<sliderValue)&&(curT[1] < 50)) {
					curT[1] = curT[1] + 10;
					countR++;
				}
			}
		}
		if((curT[1] == '00')&&(countR<sliderValue)) {
			curT[1] = 10;
			countR++;
		}
		if((curT[1] == 50)&&(countR<sliderValue)) {
			curT[1] = '00';
			if(curT[0] == 12){
				curT[0] = 1;
			}
			else {
				curT[0] = curT[0] + 1;
			}
			if((curT[0] == 12)&&(curT[2] == 'AM')){
				curT[2] = 'PM';
			}
			else if((curT[0] == 12)&&(curT[2] == 'PM')){
				curT[2] = 'AM';
			}
			countR++;
		}
	}
	if(sliderValue<countR) {
		if((curT[1] > 10)&&(curT[1] <= 50)) {
			for(i=0;i<sliderValue;i++){
				if((countR>sliderValue)&&(curT[1] > 10)) {
					curT[1] = curT[1] - 10;
					countR--;
				}
			}
		}
		if((curT[1] == '00')&&(countR>sliderValue)) {
			curT[1] = 50;
			if(curT[0] == 12){
				curT[0] = 11;
			}
			else {
				curT[0] = curT[0] - 1;
			}
			if((curT[0] == 12)&&(curT[2] == 'PM')){
				curT[2] = 'AM';
			}
			else if((curT[0] == 12)&&(curT[2] == 'AM')){
				curT[2] = 'PM';
			}
			countR--;
		}
		if((curT[1] == 10)&&(countR>sliderValue)) {
			curT[1] = '00';
			
			countR--;
		}
		if((curT[1] > 10)&&(curT[1] <= 50)) {
			for(i=0;i<sliderValue;i++){
				if((countR>sliderValue)&&(curT[1] > 10)) {
					curT[1] = curT[1] - 10;
					countR--;
				}
			}
		}
		if((curT[1] == '00')&&(countR>sliderValue)) {
			curT[1] = 50;
			if(curT[0] == 12){
				curT[0] = 11;
			}
			else {
				curT[0] = curT[0] - 1;
			}
			if((curT[0] == 12)&&(curT[2] == 'PM')){
				curT[2] = 'AM';
			}
			else if((curT[0] == 12)&&(curT[2] == 'AM')){
				curT[2] = 'PM';
			}
			countR--;
		}
		if((curT[1] == 10)&&(countR>sliderValue)) {
			curT[1] = '00';
			
			countR--;
		}
	}	
}
function timeChangeRadar() {
	urlRadar=`https://tilecache.rainviewer.com/v2/radar/${unixT}/256/${zoom}/${lat}/${lon}/4/0_1.png`;
	$('#radarOverlay').empty();
	$('#radarOverlay').append(`<img src="${urlRadar}" id="radarImg" alt="radar overlay"></img>`);
	radarInput();
}
function sixtday() {
	let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city},${state}&units=I&key=${apiKeyWB}`;
	fetch(url)
  .then(response => {
    if (response.ok) {
        return response.json();
      }
      throw new Error(response);
    })
  .then(responseJson => sixtdayDisplay(responseJson))
  .catch(err => {
    console.log(err);
  });
}
function sixtdayDisplay(responseJson) {
	let desc = [];
	let imgUrl = [];
	let high = [];
	let low = [];
	let days = sixtDayDates();
	days[0][0] = 'Today';
	days[1][0] = '';
	days[0][1] = 'Tommorow';
	days[1][1] = '';
	for(i=0;i<16;i++) {
		desc[i] = responseJson.data[i].weather.description;
		imgUrl[i] = `https://www.weatherbit.io/static/img/icons/${responseJson.data[i].weather.icon}.png`;
		high[i] = round(responseJson.data[i].high_temp);
		low[i] = round(responseJson.data[i].low_temp);
	}
	if(desktopSize == false){
		$('#weatherData').append('<section id="sixtDaySec"></section>');
		for(i=0;i<16;i++) {
			$('#sixtDaySec').append(`<div><h5>${days[0][i]} ${days[1][i]}</h5><img src="${imgUrl[i]}" alt="weather icon"></img><p>${low[i]}<sup>&#176</sup>   ${high[i]}<sup>&#176</sup></div>`);
		}
	}
	if(desktopSize == true){
		for(i=0;i<16;i++) {
			$('#sixtDayPage').append(`<div><h4>${days[0][i]} ${days[1][i]}</h4><h5>${desc[i]}</h5><img src="${imgUrl[i]}" alt="weather icon"></img><p>${low[i]}<sup>&#176</sup>   ${high[i]}<sup>&#176</sup></div>`);
	}
	$('#sixtDayPage').append('<button id="sixtDayButtonBack">Back</button>');
	$('#sixtDayButtonBack').unbind().click(function() {
		$('#sixtDayPage').empty();
		desktopDisplay();
	});
	}
}
function sixtDayDates() {
	let current = new Date();
	let currentArr = current.toString().split(" ").slice(1,3);
	let curMon = currentArr[0];
	let curDay = parseInt(currentArr[1]);
	let dayArr = [];
	let monArr = [];
	let arrCount = 0;
	if ((curMon == 'Jan')||(curMon == 'Mar')||(curMon == 'May')||(curMon == 'Jul')||(curMon == 'Aug')||(curMon == 'Oct')||(curMon == 'Dec')){
		for(i=curDay;i<=31;i++) {
			dayArr[arrCount] = i;
			monArr[arrCount] = curMon;
			arrCount++;
		}
		curMon = nextMonth(curMon);
	}
	if(curMon == 'Feb') {
		for(i=curDay;i<=28;i++) {
			dayArr[arrCount] = i;
			monArr[arrCount] = curMon;
			arrCount++;
		}
		curMon = nextMonth(curMon);
	}
	else {
		for(i=curDay;i<=30;i++) {
			dayArr[arrCount] = i;
			monArr[arrCount] = curMon;
			arrCount++;
		}
		curMon = nextMonth(curMon);
	}
	if ((curMon == 'Jan')||(curMon == 'Mar')||(curMon == 'May')||(curMon == 'Jul')||(curMon == 'Aug')||(curMon == 'Oct')||(curMon == 'Dec')){
		for(i=1;i<=31;i++) {
			dayArr[arrCount] = i;
			monArr[arrCount] = curMon;			
			arrCount++;
		}
		curMon = nextMonth(curMon);
	}
	if(curMon == 'Feb') {
		for(i=1;i<=28;i++) {
			dayArr[arrCount] = i;
			monArr[arrCount] = curMon;
			arrCount++;
		}
		curMon = nextMonth(curMon);
	}
	else {
		for(i=1;i<=30;i++) {
			dayArr[arrCount] = i;
			monArr[arrCount] = curMon;
			arrCount++;
		}
		curMon = nextMonth(curMon);
	}
	
	dayArr = dayArr.slice(0,16);
	monArr = monArr.slice(0,16);
	
	let dateArr = [dayArr,monArr];
	return dateArr;
}
function nextMonth(curMon) {
	switch(curMon) {
		case curMon = 'Jan':
			curMon = 'Feb';
		break;
		case curMon = 'Feb':
			curMon = 'Mar';
		break;
		case curMon = 'Mar':
			curMon = 'Apr';
		break;
		case curMon = 'Apr':
			curMon = 'May';
		break;
		case curMon = 'May':
			curMon = 'Jun';
		break;
		case curMon = 'Jun':
			curMon = 'Jul';
		break;
		case curMon = 'Jul':
			curMon = 'Aug';
		break;
		case curMon = 'Aug':
			curMon = 'Sep';
		break;
		case curMon = 'Sep':
			curMon = 'Oct';
		break;
		case curMon = 'Oct':
			curMon = 'Nov';
		break;
		case curMon = 'Nov':
			curMon = 'Dec';
		break;
		case curMon = 'Dec':
			curMon = 'Jan';
		break;
	}
	return curMon;
}
function round(num) {
	return Math.round(num);
}
function windDirection(num) {
	let dir = '';
	if((num<=360)||(num<=22.5)) {
			dir = 'N';
	}
	if((num>292.5)&&(num<=337.5)) {
			dir = 'NW';
	}
	if((num>247.5)&&(num<=292.5)) {
			dir = 'W';
	}
	if((num>202.5)&&(num<=247.5)) {
			dir = 'SW';
	}
	if((num>157.5)&&(num<=202.5)) {
			dir = 'S';
	}
	if((num>112.5)&&(num<=157.5)) {
			dir = 'SE';
	}
	if((num>67.5)&&(num<=112.5)) {
			dir = 'E';
	}
	if((num>22.5)&&(num<=67.5)) {
			dir = 'NE';
	}
	return dir;
}
function weekDays() {
	let currentDate = new Date();
	let cDay = currentDate.getDay();
	sevDayNames[0] = 'Today';
	let a = 1;
	let i = cDay+1;
	while(i<7) {
		dayNumToName(i,a);	
		i++;
		a++;
	}
	i = 0;
	while(i<=cDay) {
		dayNumToName(i,a);
		i++;
		a++;
	}
	return sevDayNames;
}
function dayNumToName(i,a) {
	if(i==0){
		sevDayNames[a] = 'Sun';
	}
	if(i==1){
		sevDayNames[a] = 'Mon';
	}
	if(i==2){
		sevDayNames[a] = 'Tue';
	}
	if(i==3){
		sevDayNames[a] = 'Wed';
	}
	if(i==4){
		sevDayNames[a] = 'Thu';
	}
	if(i==5){
		sevDayNames[a] = 'Fri';
	}
	if(i==6){
		sevDayNames[a] = 'Sat';
	}
}
function convertIcon (icon) {
	let iconLast = icon.charAt(2);
	icon = icon.slice(0, -1);
	if(icon == '01'){
		icon = 'c01';
	}
	else if((icon == '02')||(icon == '03')){
		icon = 'c02';
	}
	else if(icon == '04'){
		icon = 'c03';
	}
	else if(icon == '09'){
		icon = 'r05';
	}
	else if(icon == '10'){
		icon = 'r06';
	}
	else if(icon == '11'){
		icon = 't04';
	}
	else if(icon == '13'){
		icon = 's02';
	}
	else if(icon == '50'){
		icon = 'a01';
	}
	else {
		icon = 'c03';
	}
	icon = icon.concat(iconLast);
	return icon;
}
$(weather);