function init() {
    // 1 - https://docs.mapbox.com/help/tutorials/custom-markers-gl-js/#create-a-mapbox-gl-js-map
    mapboxgl.accessToken = 'pk.eyJ1IjoiaGF1bnRlZHBpbmVhcHBsZSIsImEiOiJja3prOTIybHU0dGk3MnVua2k3aHBpcTA5In0.V3BXVkZwAykB1qjsodhwXw';

    // 2 - https://docs.mapbox.com/help/tutorials/custom-markers-gl-js/#load-geojson-data
    // https://geojson.org/ | http://geojson.io/#map=2/20.0/0.0
    const geojson = {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [-77.032, 38.913]
                },
                properties: {
                    title: 'Mapbox',
                    description: 'Washington, D.C.'
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [-122.414, 37.776]
                },
                properties: {
                    title: 'Mapbox',
                    description: 'San Francisco, California'
                }
            },
            {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [-77.672, 43.082]
                },
                properties: {
                    title: 'RIT',
                    description: 'Rochester, New York'
                }
            }
        ]
    };

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-96, 37.8],
        zoom: 3
    });

    // 3 - https://docs.mapbox.com/help/tutorials/custom-markers-gl-js/#add-html-markers
    // add markers to map
    for (const feature of geojson.features) {
        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';

        // make a marker for each feature and add to the map
        // 4 - https://docs.mapbox.com/help/tutorials/custom-markers-gl-js/#add-popups
        new mapboxgl.Marker(el)
            .setLngLat(feature.geometry.coordinates)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML(
                        `<h3>${feature.properties.title}</h3>
                     <p>${feature.properties.description}</p>`
                    )
            )
            .addTo(map);
    }
}
export { init };