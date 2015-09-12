L.mapbox.accessToken = 'pk.eyJ1IjoiYW1yZWV0YW1hcHMiLCJhIjoiT0xMbndybyJ9.WDWX26jD9CcJCv7AC69dPw';
var geolocate = document.getElementById('geolocate');
var map = L.mapbox.map('map', 'mapbox.streets');

var myLayer = L.mapbox.featureLayer().addTo(map);
var myLayer2 = L.mapbox.featureLayer().addTo(map);

// This uses the HTML5 geolocation API, which is available on
// most mobile browsers and modern browsers, but not in Internet Explorer
//
// See this chart of compatibility for details:
// http://caniuse.com/#feat=geolocation
if (!navigator.geolocation) {
    geolocate.innerHTML = 'Geolocation is not available';
} else {
    geolocate.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        map.locate();
    };
}

// Once we've got a position, zoom and center the map
// on it, and add a single marker.
map.on('locationfound', function(e) {
    map.fitBounds(e.bounds);

    myLayer.setGeoJSON({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [e.latlng.lng, e.latlng.lat]
        },
        properties: {
            'title': 'Here I am!',
            'marker-color': '#ff8888',
            'marker-symbol': 'star'
        }
    });

    myLayer2.setGeoJSON({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [0, 0]
        },
        properties: {
            'title': 'Here I am!',
            'marker-color': '#008888',
            'marker-symbol': 'star'
        }
    });

    var firebaseRef = new Firebase("https://squadapp.firebaseio.com/locations/4321");
    firebaseRef.set({lat: e.latlng.lat, lon: e.latlng.lng});
    // And hide the geolocation button
    geolocate.parentNode.removeChild(geolocate);
});

// If the user chooses not to allow their location
// to be shared, display an error message.
map.on('locationerror', function() {
    geolocate.innerHTML = 'Position could not be found';
});


  var firebaseRef = new Firebase("https://squadapp.firebaseio.com/geofire/");
var geoFire = new GeoFire(firebaseRef);