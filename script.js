var docCookies = {
  getItem: function (sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    if (!sKey) { return false; }
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};

L.mapbox.accessToken = 'pk.eyJ1IjoiYW1yZWV0YW1hcHMiLCJhIjoiT0xMbndybyJ9.WDWX26jD9CcJCv7AC69dPw';
var geolocate = document.getElementById('geolocate');
var map = L.mapbox.map('map', 'mapbox.streets');

//FIRST CHECK COOKIES
if(docCookies.getItem("room") == null){
    var firebaseRef = new Firebase("https://squadapp.firebaseio.com/");

    //First ID of room
    var FBroomlocation = firebaseRef.push();

    //second ID of User
    var FBuserlocation = FBroomlocation.push({x:10, y:5});

    //console.log(FBroomlocation)
    var roomKey = FBroomlocation.key();
    //console.log(roomKey);
    var userKey = FBuserlocation.key();
    //console.log(userKey);

    docCookies.setItem("room",roomKey);
    docCookies.setItem("UID",userKey);
    
} else {
    var firebaseRef = new Firebase("https://squadapp.firebaseio.com/");

    //First ID of room
    var FBroomlocation = firebaseRef.child(docCookies.getItem("room"));
    console.log("room cookie : " + docCookies.getItem("room"))

    //second ID of User
    var FBuserlocation = FBroomlocation.child(docCookies.getItem("UID"))
    console.log("UID cookie : " + docCookies.getItem("UID"))
}

//console.log(document.cookie);

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



  //var firebaseRef = new Firebase("https://squadapp.firebaseio.com/geofire/");
