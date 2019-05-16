var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var earthquakes = new L.LayerGroup();
var plates = new L.LayerGroup();

d3.json(url).then(function(data) {
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: function(feature) {
      return {
        color: getColor(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        radius: getRadius(feature.properties.mag),
        fillOpacity: 0.9
      };
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }

  }).addTo(earthquakes);

  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
          mag = [0, 1, 2, 3, 4, 5],
          labels = [];

      // loop through magnitude intervals and create a label with a colored square for each interval
      for (var i = 0; i < mag.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(mag[i] + 1) + '"></i> ' +
              mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
      }

      return div;
  };

  legend.addTo(myMap);


});


function getColor(magnitude) {
  switch (true) {
    case magnitude > 5:
      return "#ea2c2c";
    case magnitude > 4:
      return "#ea822c";
    case magnitude > 3:
      return "#ee9c00";
    case magnitude > 2:
      return "#eecc00";
    case magnitude > 1:
      return "#d4ee00";
    default:
      return "#98ee00";
  }
};

function getRadius(magnitude) {
  if (magnitude === 0) {
    return 1;
  }

  return magnitude * 4;
};


var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
});

var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-satellite",
  accessToken: API_KEY
});


var baseMaps = {
  Light: light,
  Outdoors: outdoors,
  Satellite: satellite
};


var overlayMaps = {
  Earthquakes: earthquakes
};

// Create map object and set default layers
var myMap = L.map("map", {
  center: [39.0119, -98.4842],
  zoom: 5,
  layers: [outdoors, earthquakes]
});

L.control.layers(baseMaps, overlayMaps).addTo(myMap);
