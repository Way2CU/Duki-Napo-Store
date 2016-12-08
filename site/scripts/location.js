// create or use existing site scope
var Site = Site || {};

Site.map = function (langitude, latitude) {
	var mapCanvas = document.getElementById('map');
	var mapOptions = {
		center: {lat: langitude, lng: latitude},
		zoom: 17
	}

	var map = new google.maps.Map(mapCanvas, mapOptions);

	var marker = new google.maps.Marker({
		position:{lat: langitude, lng: latitude},
		map: map,
		title: "DukiveNapo Shop",
	});
}

$(function(){
	Site.location = new Site.map(32.063215, 34.767159);
});