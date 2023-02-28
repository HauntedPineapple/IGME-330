import * as ajax from "./ajax.js";
import * as classes from "./classes.js";
// import { addMarker, addMarkersToMap, removeAllMarkers, createLayers } from "./map.js";

let map, dates, index;
let geojson = {
    type: 'FeatureCollection',
    features: []
};
let markers = [];

function initMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaGF1bnRlZHBpbmVhcHBsZSIsImEiOiJja3prOTIybHU0dGk3MnVua2k3aHBpcTA5In0.V3BXVkZwAykB1qjsodhwXw';
    // https://docs.mapbox.com/help/tutorials/custom-markers-gl-js/#create-a-mapbox-gl-js-map
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-96, 37.8],
        zoom: 3
    });
}

function init() {
    initMap();
    loadData();
}

function loadData() {
    const url = "data/time_series_covid19_confirmed_global.csv";

    // callback function for when data shows up
    function dataLoaded(string) {
        //console.log(`string=${string}`);
        let regions = parseCSV(string);
        //console.log(regions);
        geojson = makeGeoJSON(regions);
        addMarkersToMap();
        createLayers();
        setupUI();

        console.log(geojson);
    }

    ajax.downloadFile(url, dataLoaded);
}

function parseCSV(csv) {
    // 1 - 'regions' will hold `Region` instances
    let regions = [];
    // 2 - We will turn the csv, which is now just a big string,
    // into an array of rows by splitting on new line characters
    // We will also get rid of any leading or trailing spaces with .trim()
    let rows = csv.trim().split("\n");

    // 3 - Grab the first row, which is the names of the fields (headers)
    // Province/State, Country/Region, Latitude, Longitude, 1/22/20, ...
    let fieldNames = rows.shift().split(",");
    // get rid of the first 4 field names, which leaves us with just the dates
    fieldNames.splice(0, 4);
    // the variable 'dates' now points at this array of dates
    dates = fieldNames;
    // this will point to the most recent date in the spreadsheet (the right-most column)
    index = dates.length - 1;

    // 4 - Loop through the rows and split again, this time on commas
    // this gives us an array of values starting at the value
    // for the first date in the spreadsheet
    // 4.1 - here's the regex we'll use to detect 1 or more commas inside of quotes
    // https://stackoverflow.com/questions/26664371/remove-more-than-one-comma-in-between-quotes-in-csv-file-using-regex?rq=1
    const regex = /,(?!(([^"]*"){2})*[^"]*$)/;
    for (let row of rows) {
        // 4.2 - replace the commas inside the quotes with a dash
        row = row.replace(regex, " - ");

        // 4.3 - get rid of all quotes in the 'row' since we don't need them anymore
        row = row.replace(/"/g, "");

        // 4.4 - the extra comma(s) and quotes are gone, now turn 'row' into an array
        row = row.split(",");
        regions.push(new classes.Region(row));
    }

    return regions;
}

function makeGeoJSON(regions) {
    const geojson = {
        type: 'FeatureCollection',
        features: []
    };

    // loop through all of the regions
    for (let region of regions) {

        // An "empty" GeoJSON "feature"
        const newFeature = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: []
            },
            properties: {
                title: "",
                description: "None"
            }
        };

        // Initialize '.geometry.coordinates'
        newFeature.geometry.coordinates = [+region.longitude, +region.latitude];

        // Initialize '.properties.title' - and do so differently based 
        //on whether or not the region has a '.provinceOrStateProperty
        newFeature.properties.title = region.provinceOrState ? region.provinceOrState + " - " + region.countryOrRegion : region.countryOrRegion;

        // Display the most recent data ('index')
        let numCases = region.data[index];

        // Create 'numCases' and 'allCases' properties
        newFeature.properties.numCases = numCases;
        newFeature.properties.allCases = region.data;

        // Initialize '.properties.description'
        newFeature.properties.description = numCases + " cases";

        // Add the new feature to the array
        geojson.features.push(newFeature);
    }

    return geojson;
}

function addMarker(coordinates, title, description, className) {
    let el = document.createElement("div");
    el.className = className;

    let marker = new mapboxgl.Marker(el)
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(`<h3>${title}</h3><p>${description}</p>`))
        .addTo(map);

    markers.push(marker);
}

function removeAllMarkers() {
    for (let m of markers) {
        m.remove();
    }
    markers = [];
}

function addMarkersToMap() {
    // reset markers
    removeAllMarkers();
    // add markers to map
    for (const feature of geojson.features) {
        // create a HTML element for each feature
        addMarker(feature.geometry.coordinates, feature.properties.title, feature.properties.description, "marker");
    }
}

function createLayers() {
    // https://docs.mapbox.com/mapbox-gl-js/api/#map#loaded
    if (map.loaded()) {
        addCircleAndTextLayers();
    } else {
        map.on('load', addCircleAndTextLayers);
    }

    function addCircleAndTextLayers() {
        // 1 - here we "bind" the map to our `geojson` data
        // later on when we change `geojson` data to point at a different date, we will
        // be able to easily tell the map to refresh itself and display the new data
        map.addSource('cases', {
            type: 'geojson',
            data: geojson
        });


        // 2 - the first layer we are adding is of the `circle` type
        // https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#circle
        // other layer types include "background", "fill", "symbol" and "heatmap"
        // here we are drawing "ornamental" red circles, all of the same size
        // but we could also vary the size of the circles based on number of cases
        // note our use of the "paint" property below
        map.addLayer({
            id: 'cases-circle-varying',
            type: 'circle',
            source: 'cases', // we bound the `geojson` object to the "cases" name with `map.addSource()` above
            minzoom: 3,
            "paint": {
              'circle-stroke-color': 'white',
              'circle-stroke-width': 0,
              'circle-opacity': 0.3,
              'circle-translate': [1,-4],
              'circle-radius': {
                      property: 'numCases',
                      stops: [
                          [0, 18],  // if there are 0 cases, the circle radius is 18
                          [50, 25], // if there are 50 cases, the circle radius is 25
                          [1000, 40], // if there are 1000 cases, the circle radius is 40
                          [10000, 50], // if there are 10000 or more cases, the circle radius is 50
                          /*
                          Between 0 & 50 cases, the radius of the circle will interpolate from 18 to 25
                          Between 50 & 1000 cases, the radius of the circle will interpolate from 25 to 40
                          Between 1000 & 10000 cases, the radius of the circle will interpolate from 40 to 50
                          */
                      ]
                  },
                  'circle-color': {
                      property: 'numCases',
                      stops: [
                          [0, "#00FF00"], // if there are 0 cases, the circle is green
                          [1, "#555555"], // if there is 1 case, the circle is gray
                          [50, "#FFFF00"],// if there are 50 cases, the circle is yellow
                          [10000, "#FF0000"] // if there are 10000 or more cases, the circle is red
                          /*
                          Between 1 & 50 cases, the color of the circle will interpolate from gray to yellow
                          Between 50 & 10000 cases, the color of the circle will interpolate from yellow to red
                          */
                      ],
                  }
              }
          });
        // map.addLayer({
        //     id: 'cases-circle',
        //     type: 'circle',
        //     source: 'cases',
        //     minzoom: 3,
        //     'paint': {
        //         'circle-radius': 18,
        //         'circle-color': '#ff0000',
        //         'circle-stroke-color': 'white',
        //         'circle-stroke-width': 0,
        //         'circle-opacity': 0.1,
        //         'circle-translate': [1, -4], // [x,y]
        //     },
        // }); // end circle layer code


        // 3 - the second layer is a "symbol" layer that let's us draw text - here the 
        // number of diagnosed cases
        // Note that we are specifying both "paint" properties and "layout" properties
        // https://docs.mapbox.com/mapbox-gl-js/style-spec/layers/#symbol
        // https://docs.mapbox.com/help/glossary/layout-paint-property/
        map.addLayer({
            id: 'num-cases-text',
            type: 'symbol',
            source: 'cases',
            'paint': {
                'text-color': 'red',
                'text-translate': [0, -29] // [x,y]
            },
            'layout': {
                'text-field': ['get', 'numCases'], // this is grabbing `feature.properties.numCases`
            }
        }); // end text layer code

    } // end inner function `addCircleAndTextLayers()`

} // end function `createLayers()`

function setupUI() {
    // 1 - clear out the <select>
    dateSelect.innerHTML = "";

    // 2 - loop through `dates` array
    for (let d of dates) {
        // add an <option> for each date
        let option = document.createElement("option");
        option.innerText = d;
        dateSelect.appendChild(option);
    }

    // 3 - make the last date the selected one
    dateSelect.lastChild.selected = "selected"; // show last date

    // 4 - when the <select> is changed ...
    dateSelect.onchange = e => {
        // get the value (the text, in this case) of the current <option>
        let value = e.target.value.trim();

        // look for that value in the `dates` array
        index = dates.findIndex(el => el.trim() == value);
        updateGeoJSON(geojson);
        addMarkersToMap(geojson);

        console.log(`index is now ${index}`);
    };
}

function updateGeoJSON(geojson) {
    // 1 - loop through array of features and update `numCases` to reflect current date
    for (let feature of geojson.features) {
        const numCases = feature.properties.allCases[index];
        feature.properties.numCases = numCases;
        feature.properties.description = numCases + " cases";
    }

    // 2 - tell the map to reload the data, which will cause the symbol layer to refresh
    map.getSource('cases').setData(geojson);
}

export { init };