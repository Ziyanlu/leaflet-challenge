// Create a map object
var myMap = L.map("map", {
    center: [40.76, -111.89],
    zoom: 5
  });

// Define variables for our tile layers
var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
}).addTo(myMap);

var queryUrl =  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(mag) {
    return mag * 40000;
    }
// Define a markerColor function that will give each city a different radius based on its population
 function markerColor(mag) {
     
        if (mag > 5) {
            return "red";
        }
        else if (mag > 4) {
            return "darkorange";
        }
        else if (mag > 3) {
            return "orange";
        }
        else if (mag > 2) {
            return "gold";
        }
        else if (mag > 1) {
            return "yellow";
        }
        else {
            return "green";
        };
    }
// Perform a GET request to the query URL
d3.json(queryUrl, function(response) {
       
        // Pull the "feature" property off of response.data
        var earthquateFeatures = response.features;
        
        // Loop through the stations array
        for (var i = 0; i < earthquateFeatures.length; i++) {
        
        var latitude = earthquateFeatures[i].geometry.coordinates[1];
        var longitude =earthquateFeatures[i].geometry.coordinates[0];
        var mag = earthquateFeatures[i].properties.mag;
        // console.log(mag);
        var newMarker = L.circle([latitude, longitude],
            {fillOpacity: 0.55,
            color: "black",
            fillColor: markerColor(mag),
            weight: 0.5,
            radius: markerSize(mag),
            }).bindPopup("<h1> Place: " + earthquateFeatures[i].properties.place + "</h1> <hr> <h3> Magnitude: " + mag +"</h3>")
                .addTo(myMap)};
  });
  
// Create the colors for the legend
function magColor(d) {
    return d > 5 ? '#FF0000' :
           d > 4 ? '#FF8C00' :
           d > 3 ? '#FFD700' :
           d > 2 ? '#FFFF00' :
           d > 1 ? '#9ACD32' :
                   '#008000';
  }
  
// Create the legend
let legend = L.control({
    position: 'bottomright'
  });

  legend.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'info legend'),
          labels = ['<strong><center>Magnitude</center></strong>'],
          magnitude = [0, 1, 2, 3, 4, 5];

      for (let i = 0; i < magnitude.length; i++) {
        div.innerHTML +=
        labels.push(
          '<i style="background:' + magColor(magnitude[i] + 1) + '"> </i> ' + 
          magnitude[i] + (magnitude[i + 1] ? ' - ' + magnitude[i + 1] + '<br>' : ' + '));
      }
  
      div.innerHTML = labels.join('');
      return div;
  };
  
  legend.addTo(myMap);

      