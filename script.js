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
var joinroom = document.getElementById('joinroom');
var map = L.mapbox.map('map', 'mapbox.streets');
var flip = 0;


if (!navigator.geolocation) {
    geolocate.innerHTML = 'Geolocation is not available';
} else {
    geolocate.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        doCookies()
        setRoomID();
        getLocation();
    };
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pushPosition);
    } else { }
}

function pushPosition(position) {
    FBuserlocation.set({x:position.coords.latitude, y:position.coords.longitude});
    map.locate();
}

joinroom.onclick = function(e){
    var roomdata = document.getElementById("roomtext").value;
    docCookies.setItem("room",roomdata);
    doCookies();
    setRoomID();
    getLocation();
}
function doCookies(){
    //FIRST CHECK COOKIES
    if(docCookies.getItem("room") == null){
        firebaseRef = new Firebase("https://squadapp.firebaseio.com/");

        //First ID of room
        FBroomlocation = firebaseRef.push();

        //second ID of User
        FBuserlocation = FBroomlocation.push({x:0, y:0})

        //console.log(FBroomlocation)
        roomKey = FBroomlocation.key();
        //console.log(roomKey);
        userKey = FBuserlocation.key();
        //console.log(userKey);

        docCookies.setItem("room",roomKey);
        docCookies.setItem("UID",userKey);

    } else {
        firebaseRef = new Firebase("https://squadapp.firebaseio.com/");

        //First ID of room
        FBroomlocation = firebaseRef.child(docCookies.getItem("room"));
        console.log("room cookie : " + docCookies.getItem("room"))

        //second ID of User
        if(docCookies.getItem("UID") == null){
            FBuserlocation = FBroomlocation.push({x:0, y:0});
            userKey = FBuserlocation.key();
            docCookies.setItem("UID",userKey);
        } else {
            FBuserlocation = FBroomlocation.child(docCookies.getItem("UID"))
            console.log("UID cookie : " + docCookies.getItem("UID"))
        }
        
    }
}
//console.log(document.cookie);

function setRoomID(){
    var room = docCookies.getItem("room");
    document.getElementById("roomID").value = "Your room id is " + room;
    document.getElementById("nav").style.visibility="visible";
}

var myLayer = L.mapbox.featureLayer().addTo(map);
var myLayer2 = L.mapbox.featureLayer().addTo(map);

// This uses the HTML5 geolocation API, which is available on
// most mobile browsers and modern browsers, but not in Internet Explorer
//
// See this chart of compatibility for details:
// http://caniuse.com/#feat=geolocation


// Once we've got a position, zoom and center the map
// on it, and add a single marker.
map.on('locationfound', function(e) {

    //FBroomlocation.on("value", function(snapshot){
    //console.log(snapshot.val());
    //});
    var count = 0;
    var x1 = e.latlng.lng;
    var y1 = e.latlng.lat;
    var x2 = e.latlng.lat;
    var y2 = e.latlng.lat;
    FBroomlocation.on("value", function(snapshot){
        snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                if(count == 0){
                    x1 = childData.x
                    y1 = childData.y
                } else if(count == 1) {
                    x2 = childData.x
                    y2 = childData.y
                }
                count = count + 1
            }

        );
    });

    console.log(x1 + "$$$$" + y1 + "$$$$" + x2 + "$$$$" +y2)

    myLayer.setGeoJSON({
        type: 'Feature',
        geometry: {
            type: 'Point',
            //coordinates: [e.latlng.lng, e.latlng.lat]
            coordinates: [y1, x1]
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
            coordinates: [y2, x2]
        },
        properties: {
            'title': 'Here I am!',
            'marker-color': '#008888',
            'marker-symbol': 'star'
        }
    });

    // And hide the geolocation button
    console.log("THIS IS WORKING");
    if(flip == 0){
        setInterval(function(){getLocation();}, 3000);
        flip = 1;
        geolocate.parentNode.removeChild(geolocate);
    roomtext.parentNode.removeChild(roomtext);
    joinroom.parentNode.removeChild(joinroom);
    map.fitBounds(e.bounds);
    }
});

// If the user chooses not to allow their location
// to be shared, display an error message.
map.on('locationerror', function() {
    geolocate.innerHTML = 'Position could not be found';
});



  //var firebaseRef = new Firebase("https://squadapp.firebaseio.com/geofire/");
