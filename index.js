const states = { 
	"AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado","CT":"Connecticut","DE":"Delaware","DC":"District of Colombia","FL":"Florida","GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire", "NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming"
};

function getLocation() {
  let url='https://ipinfo.io?token=39ac838b653d15';
	
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response);
    })
    .then(responseJson => locationSave(responseJson))
    .catch(err => {
      console.log(err);
    });
}
function locationSave(responseJson) {
  let city = responseJson.city;
  let state = responseJson.region;
	displayLocation(city,state);
}
function displayLocation(city,state) {
  $('#searchBar').empty();
  $('#searchBar').append(`<input type="text" id="search" value="${city}, ${state}">`);
  $(submit);
}
function submit() {
  $('#magGlass').click((event) => {
		getCitySt();
  });
  $('form').submit((event) => {
		getCitySt();
  });
}
function getCitySt() {
	let citySt="";
	citySt = $('#search').val();
	localStorage.clear();
	
	cityStArr = citySt.split(",");
	city = cityStArr[0];
	state = cityStArr[1];
	city = city.trim();
	state = state.trim();
	
	console.log(city,state);
	state = stateConvert(state);
	console.log(city,state);
	citySt = `${city}, ${state}`;
	localStorage.setItem("citySt", citySt);
	localStorage.setItem("city", city);
	localStorage.setItem("state", state);
}
function stateConvert(state) {
	let stateLength = state.length;
	if(stateLength == 2) {
		state = state.toUpperCase();
		state = states[state];
		console.log(state);
		return state;
	} 
	else {
		return state;
	}
}

$(getLocation);
