'use strict';

var tableControl = require('./table_control.js');

module.exports = function(container, directions) {
    var control = {}, map;
    var origChange = false, destChange = false;
    var TRACKINFO_API_URL = "http://luliu.me/tracks/api/v1/trackinfo";
    var TRACK_API_URL = "http://luliu.me/tracks/api/v1/tracks";

    control.addTo = function(_) {
        map = _;
        return control;
    };

    // get page 1 of trackinfo as init data for the table
    // Web browser compatibility:
    // for IE7+, Firefox, Chrome, Opera, Safari
    container = document.getElementById(container);
    container.insertAdjacentHTML('afterbegin', '<table id="table" class="prose"></table>');

    var trackinfoXhr = new XMLHttpRequest();
    var keys = [], values = [];
    trackinfoXhr.onreadystatechange = function() {
        if (trackinfoXhr.readyState === 4 && trackinfoXhr.status === 200) {
            var trackinfoData = JSON.parse(trackinfoXhr.responseText);
            keys = Object.keys(trackinfoData.objects[0]);
            values = [];
            trackinfoData.objects.forEach(function(data) {
                var row = Object.keys(data).map(function(key){
                    return data[key];
                });
                values.push(row);
            });

            var tc = new tableControl(document.getElementById('table'), keys, values);
            tc.onSelected(function(data) {
                var startPos = L.GeoJSON.coordsToLatLng([data[12], data[11]]);
                var endPos = L.GeoJSON.coordsToLatLng([data[4], data[3]]);
                directions.setOrigin(startPos);
                directions.setDestination(endPos);
                map.panTo(startPos);
                // Web browser compatibility: 
                // IE7+, Firefox, Chrome, Opera, Safari
                var trackXhr = new XMLHttpRequest();
                trackXhr.onreadystatechange = function() {
                    if (trackXhr.readyState === 4 && trackXhr.status === 200) {
                        var trackData = JSON.parse(trackXhr.responseText);
                        directions.selectTrack(trackData);
                    }
                }
                trackXhr.open("GET", TRACK_API_URL + "/" + data[6], true);
                trackXhr.send();
            });
        }
    }
    trackinfoXhr.open("GET", TRACKINFO_API_URL, true);
    trackinfoXhr.send();

    return control;
};
