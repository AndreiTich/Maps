L.mapbox.accessToken = 'pk.eyJ1IjoiYW1yZWV0YW1hcHMiLCJhIjoiT0xMbndybyJ9.WDWX26jD9CcJCv7AC69dPw';
var geolocate = document.getElementById('geolocate');
var map = L.mapbox.map('map', 'mapbox.streets');

var firebaseRef = new Firebase("https://squadapp.firebaseio.com/");
//First ID of room
var FBroomlocation = firebaseRef.push();

//second ID of User
var FBuserlocation = FBroomlocation.push({x:10, y:5});
var FBuserlocation = FBroomlocation.push({x:1, y:50});
var FBuserlocation = FBroomlocation.push({x:15, y:55});

console.log(FBroomlocation)
var roomKey = FBroomlocation.key();
console.log(roomKey);
var userKey = FBuserlocation.key();
console.log(userKey);

FBroomlocation.on("value", function(snapshot){

    console.log(snapshot.val())

})




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