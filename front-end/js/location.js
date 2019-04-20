var haightAshbury = {lat: 50.450280, lng: 30.526336};
var map;
var trafficLayer;
var infoWindow;
var markers = [];
var geocoder;

function initMap(data) {
  if(data != null){
    haightAshbury = {
      lat: parseInt(data.maj),
      lng: parseInt(data.gaj)
    };
  }


  map = new google.maps.Map(document.getElementById('map'), {
    center: haightAshbury,
    zoom: 13,
    mapTypeId: 'roadmap',
    streetViewControl: false,

  });

  if(data != null){

    addMarker(haightAshbury, data.nameStreet);
  }

  if(document.location.pathname != "/Post"){
    trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    geocoder = new google.maps.Geocoder;
    infoWindow = new google.maps.InfoWindow;

    map.addListener('click', function(event) {
      if(document.getElementById('pac-input-from') != null){
          geocoder.geocode({'location': event.latLng}, function(results, status) {
            if (status === 'OK') {
              if (results[0]) {
                  if(document.getElementById('mapJson')){
                    console.log(results[0].geometry.viewport);
                    document.getElementById('mapJson').value = results[0].geometry.viewport;
                  }
                document.getElementById('pac-input-from').value = results[0].formatted_address;
              } else {
                window.alert('No results found');
              }
            } else {
              window.alert('Geocoder failed due to: ' + status);
            }
          });
      }
      addMarker(event.latLng, "Дім");
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent('You');
        infoWindow.open(map);
        map.setCenter(pos);
        map.setZoom(17);
        }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
    // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }

    var searchBox = new google.maps.places.SearchBox(document.getElementById('pac-input-from')) ;

    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }

        // Create a marker for each place.
        addMarker(place.geometry.location, place.name);
        if(place && place.geometry && place.geometry.viewport){
          document.getElementById('mapJson').value = place.geometry.viewport;
        }
      //  document.getElementById('mapJson').value = results[0].geometry.bounds;

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  }
}
var geocoder;

function addMarker(location, title) {
  clearMarker();
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    title: title
  });
  markers.push(marker);
}

function clearMarker(){
  markers.forEach(function(marker) {
    marker.setMap(null);
  });
  markers = [];
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}
