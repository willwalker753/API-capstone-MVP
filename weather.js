let city = sessionStorage.getItem("city");
let state = sessionStorage.getItem("state");
let lat;
let lon;
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
  let citySt = sessionStorage.getItem("citySt");
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
	let width = $(document).width();
	if(width<700) {
		desktopSize = false;
		$('#buttons').append('<button id="current">Current Weather</button><button id="7Day">7 Day Forecast</button><button id="radar">Weather Radar</button><button id="16Day">16 day Forecast</button>');
		weatherSelect();
	}
	else {
		desktopSize = true;
		$('#buttons').empty();
		$('body').append('<div id="desktopAll"></div><div id="sixtDayPage"></div>');
		desktopDisplay();
	}
}
function desktopDisplay() {
	$('#mobile').remove();
	$('#desktopAll').append('<section id="topRow"><div id="currentBox"></div><div id="radarBox"><div id="map" class="map"></div><section id="radarControls"><div id="sliderBox"></div><div id="timeForward"></div><div id="zoomButtons"></div></section></div></section><section id="bottomRow"><div id="sevDayBox"></div><div id="sixtDayBox"><button id="sixtDayButton">Show more</button></div></section>');
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
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${state}&units=imperial&appid=${apiKeyOWM}`;
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
	if(desktopSize == false){
		weatherSelect();
	}
}
function displayCurrentWeather(responseJson) {
	let desc = responseJson.weather[0].description;
	let icon = convertIcon(responseJson.weather[0].icon);
	let imgUrl = (`https://www.weatherbit.io/static/img/icons/${icon}.png`);
	convertIcon(responseJson.weather[0].icon);
	let currentT = round(responseJson.main.temp);
	let feel = round(responseJson.main.feels_like);
	let minT = round(responseJson.main.temp_min);
	let maxT = round(responseJson.main.temp_max);
	let hum = round(responseJson.main.humidity);
	let wSpe = round(responseJson.wind.speed);
	let wDir = windDirection(responseJson.wind.deg);
	if(desktopSize == false) {
		$('#weatherData').append(`<h3>${currentT}<sup>&#8457</sup></h3><section id="curMobBot"><div><h1>${desc}</h1><p>Feels like ${feel}<sup>&#176</sup><br>Min ${minT}<sup>&#176</sup><br>Max ${maxT}<sup>&#176</sup><br>Humidity ${hum}%<br>Wind ${wSpe}mph ${wDir}</p></div><img src="${imgUrl}" alt="weather icon"></section>`);
	}
	if(desktopSize == true) {
		$('#currentBox').append(`<h3>${desc}</h3><img src="${imgUrl}" alt="weather icon"><h1>${currentT}<sup>&#8457</sup></h1><p>Feels like ${feel}<sup>&#176</sup><br>Min ${minT}<sup>&#176</sup><br>Max ${maxT}<sup>&#176</sup><br>Humidity ${hum}%<br>Wind ${wSpe}mph ${wDir}</p>`);
	}
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
		dayNames[1] = 'Tommorow';
		for(i=1;i<8;i++) {
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
	urlRadar=`https://tilecache.rainviewer.com/v2/radar/${unixT}/512/${zoom}/${lat}/${lon}/4/0_1.png`;
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
	curMon = nextMonth(curMon);
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
			curMon = 'January';
		break;
		case curMon = 'Feb':
			curMon = 'February';
		break;
		case curMon = 'Mar':
			curMon = 'March';
		break;
		case curMon = 'Apr':
			curMon = 'April';
		break;
		case curMon = 'Jun':
			curMon = 'June';
		break;
		case curMon = 'Jul':
			curMon = 'July';
		break;
		case curMon = 'Aug':
			curMon = 'August';
		break;
		case curMon = 'Sep':
			curMon = 'September';
		break;
		case curMon = 'Oct':
			curMon = 'October';
		break;
		case curMon = 'Nov':
			curMon = 'November';
		break;
		case curMon = 'Dec':
			curMon = 'December';
		break;
		case curMon = 'December':
			curMon = 'January';
		break;
		case curMon = 'January':
			curMon = 'February';
		break;
		case curMon = 'February':
			curMon = 'March';
		break;
		case curMon = 'March':
			curMon = 'April';
		break;
		case curMon = 'April':
			curMon = 'May';
		break;
		case curMon = 'May':
			curMon = 'June';
		break;
		case curMon = 'June':
			curMon = 'July';
		break;
		case curMon = 'July':
			curMon = 'August';
		break;
		case curMon = 'August':
			curMon = 'September';
		break;
		case curMon = 'September':
			curMon = 'October';
		break;
		case curMon = 'October':
			curMon = 'November';
		break;
		case curMon = 'November':
			curMon = 'December';
		break;
		case curMon = 'December':
			curMon = 'January';
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
			dir = 'North';
	}
	if((num>292.5)&&(num<=337.5)) {
			dir = 'Northwest';
	}
	if((num>247.5)&&(num<=292.5)) {
			dir = 'West';
	}
	if((num>202.5)&&(num<=247.5)) {
			dir = 'Southwest';
	}
	if((num>157.5)&&(num<=202.5)) {
			dir = 'South';
	}
	if((num>112.5)&&(num<=157.5)) {
			dir = 'Southeast';
	}
	if((num>67.5)&&(num<=112.5)) {
			dir = 'East';
	}
	if((num>22.5)&&(num<=67.5)) {
			dir = 'Northeast';
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
		sevDayNames[a] = 'Sunday';
	}
	if(i==1){
		sevDayNames[a] = 'Monday';
	}
	if(i==2){
		sevDayNames[a] = 'Tuesday';
	}
	if(i==3){
		sevDayNames[a] = 'Wednesday';
	}
	if(i==4){
		sevDayNames[a] = 'Thursday';
	}
	if(i==5){
		sevDayNames[a] = 'Friday';
	}
	if(i==6){
		sevDayNames[a] = 'Saturday';
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