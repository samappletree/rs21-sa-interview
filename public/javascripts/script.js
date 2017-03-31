//script.js
var map;
map = L.map('mapid').setView([35.0853, -106.6056], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2FtYXBsZXRyZWUiLCJhIjoiY2owdHhnMG52MDU3dTJxcWE5OWQ2dzJqMSJ9.2eIWFW2BvJ-M2uq2-KwhIw', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
}).addTo(map);

function onAddCensusClick() {
	$.getJSON('data/BernallioCensusBlocks_Joined.json', function(censusData){
		var censuslayer = L.geoJson(censusData, {
			style: function(feature){
				var fillColor,
			        density = feature.properties.ACS_13_5YR_B01001_with_ann_HD01_VD01;
			    if (density < 500 ) fillColor = "#e0f3db"
			    else if ( density < 1000 ) fillColor = "#ccebc5";
			    else if ( density < 1500 ) fillColor = "#a8ddb5";			    
			    else if ( density < 2000 ) fillColor = "#7bccc4";
			    else if ( density < 2500 ) fillColor = "#4eb3d3";
			    else if ( density < 3000 ) fillColor = "#2b8cbe";
			    else if ( density < 3500 ) fillColor = "#0868ac";
			    else if ( density < 4000 ) fillColor = "#084081";
			    else if ( density < 4500 ) fillColor = "#063060";
			    else if ( density < 5000 ) fillColor = "#031830";
			    else if ( density < 6000 ) fillColor = "#000000";
			    else fillColor = "#f7fcf0";  // no data
			    return { color: "#999", weight: 1, fillColor: fillColor, fillOpacity: .6 };
			},
			onEachFeature: function(feature, layer){
				layer.bindPopup(feature.properties.NAMELSAD + "<br/>Population total: " + feature.properties.ACS_13_5YR_B01001_with_ann_HD01_VD01);
			}
		}).addTo(map);
	});
}


function onAddTwitterClick() {
	$.get('data/Twitter_141103.csv', function(twitterData){
		var twitterRawData = Papa.parse(twitterData);

		var twitterJSON = {
			"type": "FeatureCollection",
			"features": []
		};

		var lines = twitterRawData.data;
		for (var i = lines.length - 6; i >= 0; i--) {
			var currentline = lines[i];
			//console.log(currentline);
			var obj = {
				"type": "Feature",
	        	"geometry": {
	        		"type": "Point", 
	        		"coordinates": [Number(currentline[3]), Number(currentline[2])]
	        	},
	        	"properties": {
	        		"Tweet": currentline[0],
	        		"Username": currentline[1],
	        		"Time": currentline[4]
	        	}
			};

			twitterJSON.features.push(obj);
		}
		//console.log(twitterJSON);

		var twitterIcon = L.icon({
			iconUrl: '/images/Twitter_Logo_Blue.png',
			iconSize: [60,50]
		});

		L.geoJson(twitterJSON, {
			pointToLayer: function(feature,latlng){
	      var marker = L.marker(latlng,{icon: twitterIcon});
	      marker.bindPopup("@" + feature.properties.Username + ' says <br/> "' + feature.properties.Tweet +'"');
	      return marker;
	    }
		}).addTo(map);

	});
}

function onAddFBClick() {
	$.get('data/FacebookPlaces_Albuquerque.csv', function(fbData){
		var fbRawData = Papa.parse(fbData);

		var fbJSON = {
			"type": "FeatureCollection",
			"features": []
		};

		var lines = fbRawData.data;
		console.log((lines.length - 2)/4);
		for (var i = (lines.length - 2)/4; i >= 0; i--) {
			var currentline = lines[i].filter(function(v){return v!==''});;
			var obj = {
				"type": "Feature",
	        	"geometry": {
	        		"type": "Point"
	        	},
	        	"properties": {
	        		"Name of Place": currentline[0],
	        	}
			};
			switch(currentline.length) {
				case 8: 
					obj.geometry.coordinates = [Number(currentline[7]), Number(currentline[6])];
					obj.properties.Category = [currentline[1], currentline[2], currentline[3], currentline[4]];
					obj.properties.Checkins = Number(currentline[5]);
					break;
				case 7:
					obj.geometry.coordinates = [Number(currentline[6]), Number(currentline[5])];
					obj.properties.Category = [currentline[1], currentline[2], currentline[3]];
					obj.properties.Checkins = Number(currentline[4]);
					break;
				case 5:
					obj.geometry.coordinates = [Number(currentline[4]), Number(currentline[3])];
					obj.properties.Category = currentline[1];
					obj.properties.Checkins = Number(currentline[2]);
					break;
			}
			console.log(obj);
			fbJSON.features.push(obj);
		}

		L.geoJson(fbJSON,  {
			onEachFeature: function(feature, layer){
				layer.bindPopup(feature.properties["Name of Place"] + "<br/>Total Facebook Checkins: " + feature.properties.Checkins);
	   		}
	    }).addTo(map);
	});
}

function clearMap(){
	map.remove();
	map = L.map('mapid').setView([35.0853, -106.6056], 13);
	L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2FtYXBsZXRyZWUiLCJhIjoiY2owdHhnMG52MDU3dTJxcWE5OWQ2dzJqMSJ9.2eIWFW2BvJ-M2uq2-KwhIw', {
	    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	    maxZoom: 18,
	}).addTo(map);
}

