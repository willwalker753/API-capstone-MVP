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
	sessionStorage.clear();
	sessionStorage.setItem("citySt", citySt);
	cityStArr = citySt.split(",");
	city = cityStArr[0];
	state = cityStArr[1];
	city = city.trim();
	state = state.trim();
	sessionStorage.setItem("city", city);
	sessionStorage.setItem("state", state);
}

$(getLocation);
