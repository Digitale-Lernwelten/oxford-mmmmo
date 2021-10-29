let hoveredIcon = new Array(5).fill(null), hoveredCircle = new Array(5).fill(null), hoveredLines = new Array(5).fill([]), hoveredDashes = new Array(5).fill([]);
let selectedIcon = null, selectedCircle = null, selectedLines = [], selectedDashes = [];

//lock screen rotation to landscape on mobile devices
screen.orientation.lock('landscape');

mapboxgl.accessToken = 'pk.eyJ1IjoiZGx3LW1tbW1vIiwiYSI6ImNrcXRvZ2JuaTAwMmkzMW8zMmJlOGpveDUifQ.5XieGJGXyN1EOV0i-fDReA';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/dlw-mmmmo/ckqtp7u2f03aq18qqzaspevm8', // style URL
    center: [10, 52], // starting position [lng, lat]
    zoom: 4.8 // starting zoom
});

map.on('style.load', () => {
    importData();
    addIconImages();
});

function addIconImages() {
    orderIcons.forEach((icon) => {
        map.loadImage('assets/map/' + icon + '.png', (error, imgData) => {
            if (error) throw error;
            map.addImage(icon, imgData, {
                sdf: true
            });
        });
    });
    map.loadImage('assets/map/line.png', (error, imgData) => {
        if (error) throw error;
        map.addImage('line', imgData);
    });
    map.loadImage('assets/map/dash.png', (error, imgData) => {
        if (error) throw error;
        map.addImage('dash', imgData);
    });
}

function addMapInfo() {
    // add icon layers
    for (let i = 0; i < iconLayers.length; i++) {
        map.addSource(iconLayers[i].source, {
            type: 'geojson',
            data: iconSources[i]
        });
        map.addLayer(iconLayers[i]);
        map.on('click', iconLayers[i].id, (e) => {
            console.log('click event');
            if (e.features.length > 0) {
                console.log('clicked on feature: ', e.features[0]);
                showEntryInfo(e.features[0].properties.id);
            }
        });
        map.on('mousemove', iconLayers[i].id, (e) => {
            map.getCanvas().style.cursor = 'pointer';
            if (e.features.length > 0) {
                // reset hover state on previous icon
                // reset icon
                if (hoveredIcon[i] !== null) {
                    map.setFeatureState(
                        { source: iconLayers[i].source, id: hoveredIcon[i].id },
                        { hover: false }
                    );
                }
                // reset radius
                if (hoveredCircle[i] !== null) {
                    map.setFeatureState(
                        { source: circleLayers[i].source, id: hoveredCircle[i].id },
                        { hover: false }
                    );
                }
                // reset lines (moved & target)
                if (hoveredLines[i].length > 0) {
                    hoveredLines[i].forEach((lineID) => {
                        map.setFeatureState(
                            { source: lineLayers[i].source, id: lineID },
                            { hover: false }
                        );
                    });
                }
                // reset dashes (origin & copies) depending on their layer (since origin/copies can have a different language)
                if (hoveredDashes[i] !== null) {
                    hoveredDashes[i].forEach((dashID) => {
                        let dashSource;
                        if (dashID < 3700) {
                            dashSource = dashLayers[0].source;
                        } else if (dashID < 3900) {
                            dashSource = dashLayers[1].source;
                        } else if (dashID < 4100) {
                            dashSource = dashLayers[2].source;
                        } else if (dashID < 4300) {
                            dashSource = dashLayers[3].source;
                        } else {
                            dashSource = dashLayers[4].source;
                        }
                        map.setFeatureState(
                            { source: dashSource, id: dashID },
                            { hover: false }
                        );
                    });
                }

                // set feature state for icon
                hoveredIcon[i] = e.features[0];
                map.setFeatureState(
                    { source: iconLayers[i].source, id: hoveredIcon[i].id },
                    { hover: true }
                );

                // set feature state for radius
                if (hoveredIcon[i].properties.radius > 0) {
                    hoveredCircle[i] = getItem('c' + hoveredIcon[i].properties.id);
                    map.setFeatureState(
                        { source: circleLayers[i].source, id: hoveredCircle[i].id },
                        { hover: true }
                    );
                }

                // add line that ends at this icon
                if (hoveredIcon[i].properties.moved) {
                    const item = getItem('l' + hoveredIcon[i].properties.id);
                    hoveredLines[i].push(item.id);
                }

                // add line that starts at this icon
                if (hoveredIcon[i].properties.target) {
                    const item = getItem('l' + hoveredIcon[i].properties.target);
                    hoveredLines[i].push(item.id);
                }

                // set feature state for all lines
                if (hoveredLines[i].length > 0) {
                    hoveredLines[i].forEach((lineID) => {
                        map.setFeatureState(
                            { source: lineLayers[i].source, id: lineID },
                            { hover: true }
                        );
                    });
                }

                // add dash that ends at this icon
                if (hoveredIcon[i].properties.origin) {
                    const item = getItem('d' + hoveredIcon[i].properties.id);
                    hoveredDashes[i].push(item.id);
                }

                // add dashes that start at this icon (one source can have multiple copies)
                if (hoveredIcon[i].properties.copies) {
                    const copiesArray = hoveredIcon[i].properties.copies.split(',');
                    copiesArray.forEach((copyID) => {
                        const item = getItem('d' + copyID);
                        hoveredDashes[i].push(item.id);
                    });
                }

                // set feature state for all dashes depending on their layer (since origin/copies can have a different language)
                if (hoveredDashes[i].length > 0) {
                    hoveredDashes[i].forEach((dashID) => {
                        let dashSource;
                        if (dashID <= 3700) {
                            dashSource = dashLayers[0].source;
                        } else if (dashID <= 3900) {
                            dashSource = dashLayers[1].source;
                        } else if (dashID <= 4100) {
                            dashSource = dashLayers[2].source;
                        } else if (dashID <= 4300) {
                            dashSource = dashLayers[3].source;
                        } else {
                            dashSource = dashLayers[4].source;
                        }
                        map.setFeatureState(
                            { source: dashSource, id: dashID },
                            { hover: true }
                        );
                    });
                }
            }
        });
        map.on('mouseleave', iconLayers[i].id, () => {
            map.getCanvas().style.cursor = '';
            if (hoveredIcon[i] !== null) {
                map.setFeatureState(
                    { source: iconLayers[i].source, id: hoveredIcon[i].id },
                    { hover: false }
                );
            }
            if (hoveredCircle[i] !== null) {
                map.setFeatureState(
                    { source: circleLayers[i].source, id: hoveredCircle[i].id },
                    { hover: false }
                );
            }
            if (hoveredLines[i] != null) {
                const linesArray = String(hoveredLines[i]).split(',');
                linesArray.forEach((lineID) => {
                    map.setFeatureState(
                        { source: lineLayers[i].source, id: lineID },
                        { hover: false }
                    );
                });
            }
            if (hoveredDashes[i] != null) {
                const dashArray = String(hoveredDashes[i]).split(',');
                dashArray.forEach((dashID) => {
                    let dashSource;
                    if (dashID < 3700) {
                        dashSource = dashLayers[0].source;
                    } else if (dashID < 3900) {
                        dashSource = dashLayers[1].source;
                    } else if (dashID < 4100) {
                        dashSource = dashLayers[2].source;
                    } else if (dashID < 4300) {
                        dashSource = dashLayers[3].source;
                    } else {
                        dashSource = dashLayers[4].source;
                    }
                    map.setFeatureState(
                        { source: dashSource, id: dashID },
                        { hover: false }
                    );
                });
            }

            hoveredIcon[i] = null;
            hoveredCircle[i] = null;
            hoveredLines[i] = [];
            hoveredDashes[i] = [];
        });
    }

    // add archive layer
    map.addSource(archiveIconLayer.source, {
        type: 'geojson',
        data: archiveIconSources
    });
    map.addLayer(archiveIconLayer);
    map.on('mousemove', archiveIconLayer.id, (e) => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', archiveIconLayer.id, (e) => {
        map.getCanvas().style.cursor = '';
    });

    // add radius layers
    for (let i = 0; i < circleLayers.length; i++) {
        map.addSource(circleLayers[i].source, {
            type: 'geojson',
            data: circleSources[i]
        });
        map.addLayer(circleLayers[i], iconLayers[0].id);
    }

    // add line layers
    for (let i = 0; i < lineLayers.length; i++) {
        map.addSource(lineLayers[i].source, {
            type: 'geojson',
            data: lineSources[i]
        });
        map.addLayer(lineLayers[i], circleLayers[0].id);
    }

    // add dash layers
    for (let i = 0; i < dashLayers.length; i++) {
        map.addSource(dashLayers[i].source, {
            type: 'geojson',
            lineMetrics: true,
            data: dashSources[i]
        });
        map.addLayer(dashLayers[i], lineLayers[0].id);
    }

    // add archive lines
    for (let i = 0; i < archiveLineLayers.length; i++) {
        map.addSource(archiveLineLayers[i].source, {
            type: 'geojson',
            data: archiveLineSources[i]
        });
        map.addLayer(archiveLineLayers[i], iconLayers[0].id);
    }

    console.log('map info added', map);
}