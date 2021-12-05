let hoveredIcon = new Array(5).fill(null), hoveredCircle = new Array(5).fill(null), hoveredLines = new Array(5).fill([]), hoveredDashes = new Array(5).fill([]);
let selectedIcon = null, selectedCircle = null, selectedLines = [], selectedDashes = [], selectedFeatures = [];

//lock screen rotation to landscape on mobile devices
screen.orientation.lock('landscape');

mapboxgl.accessToken = 'pk.eyJ1IjoiZGx3LW1tbW1vIiwiYSI6ImNrcXRvZ2JuaTAwMmkzMW8zMmJlOGpveDUifQ.5XieGJGXyN1EOV0i-fDReA';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/dlw-mmmmo/ckqtp7u2f03aq18qqzaspevm8', // style URL
    center: [10, 52], // starting position [lng, lat]
    zoom: 4.8, // starting zoom
    maxBounds: [
        [-130, 20],
        [45, 70]
    ]
});

// add geocoder control to the map
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    zoom: 14,
    flyTo: false,
    placeholder: "Suchbegriff eingeben",
    bbox: [-130, 20, 45, 70],
    localGeocoder: forwardGeocoder,
    localGeocoderOnly: true,
    marker: false,
    render: renderGeocoderItems
});

// to do: outsource marker highlighting when mapbox.on('select') to function
// also call the function here to highlight the marker
geocoder.on('result', (result) => {
    if (result.result.properties.id) {
        if (result.result.properties.year) {
            let isInactive = '';
            if(!filterGeocoderItems(result.result)) isInactive = 'inactive';
            showEntryInfo(result.result.properties.id, isInactive);
        } else {
            showArchiveEntries(result.result.properties.id);
        }
    }
});

//document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
map.addControl(geocoder)

function forwardGeocoder(query) {
    const matchingFeatures = [];
    archiveIconSources.features.forEach((feature) => {
        if (feature.properties.name.toLowerCase().includes(query.toLowerCase())) {
            feature['place_name'] = feature.properties.name;
            feature['center'] = feature.geometry.coordinates;
            feature['place-type'] = ['poi'];
            matchingFeatures.push(feature);
        }
    });
    for (let i = 0; i < iconSources.length; i++) {
        iconSources[i].features.forEach((feature) => {
            if (feature.properties.name.toLowerCase().includes(query.toLowerCase())) {
                feature['place_name'] = feature.properties.name;
                feature['center'] = feature.geometry.coordinates;
                feature['place-type'] = ['poi'];
                matchingFeatures.push(feature);
            }
        });
    }
    return matchingFeatures;
}

function renderGeocoderItems(item) {
    console.log(item);
    let imgID = 'icon-marker';
    let bgColor = 'white';
    let itemName = item['place_name'];
    if (item.properties.order) {
        imgID = returnIcon(item.properties.order);
        switch (item.properties.id.substr(0, 2)) {
            case 'od':
                bgColor = '#277BB2';
                break;
            case 'md':
                bgColor = '#7B27B2';
                break;
            case 'nd':
                bgColor = '#B2277B';
                break;
            case 'lt':
                bgColor = '#B27B27';
                break;
            case 'fr':
                bgColor = '#27B27B';
                break;
            default:
                bgColor = '#272727';
                console.log('background color not defined for: ', item.properties.id.substr(0, 2));
        }
        itemName = item.properties.name;
    }
    else if (item.properties.id) {
        imgID = 'lib';
        bgColor = iconColors.darkGrey;
        itemName = item.properties.name;
    }
    let isInactive = ''
    if(!filterGeocoderItems(item)) isInactive = 'inactive';
    return '<div class="geocoder-dropdown-item"><img class="geocoder-dropdown-icon" src="assets/orders-svg/' + imgID + '.svg" style="background-color: ' + bgColor + '"><span class="geocoder-dropdown-text ' + isInactive + '">' + itemName + '</span></div>';
}

// hinzufügen: doppelte quellen (an untersch. orten) rausfiltern, nur aktuellste version anzeigen
function filterGeocoderItems(item) {
    if (item.properties.year) {
        if (item.properties.year < slider.value) {
            if (orders.includes(item.properties.order)) {
                const cb = document.getElementById('checkbox-' + item.properties.id.substr(0, 2));
                if (cb.checked) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        if (slider.value === slider.max) {
            return true;
        } else {
            return false;
        }
    }
}

const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    maxWidth: '200px',
    offset: 12
});

map.on('style.load', () => {
    importData();
    addIconImages();
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
});

function addIconImages() {
    orderIcons.forEach((icon) => {
        map.loadImage('assets/orders-png/' + icon + '.png', (error, imgData) => {
            if (error) throw error;
            map.addImage(icon, imgData, {
                sdf: true
            });
        });
    });
    mapIcons.forEach((icon) => {
        map.loadImage('assets/map/' + icon + '.png', (error, imgData) => {
            if (error) throw error;
            map.addImage(icon, imgData);
        });
    });
}

function querySelectedFeatures() {
    if (selectedFeatures.length === 1) {
        showEntryInfo(selectedFeatures[0], '');
    } else if (selectedFeatures.length > 1) {
        showMultipleEntries();
    }
    selectedFeatures = [];
}

function addMapInfo() {
    // add icon layers
    for (let i = 0; i < iconLayers.length; i++) {
        map.addSource(iconLayers[i].source, {
            type: 'geojson',
            data: iconSources[i]
        });
        map.addLayer(iconLayers[i]);
        // reset selected features, when new click begins
        map.on('mousedown', iconLayers[i].id, (e) => {
            selectedFeatures = [];
        });
        map.on('mouseup', iconLayers[i].id, (e) => {
            if (e.features.length > 0) {
                console.log('clicked on feature: ', e.features[0]);
                //showEntryInfo(e.features[0].properties.id, '');
                for (let i = 0; i < e.features.length; i++) {
                    selectedFeatures.push(e.features[i].properties.id);
                }
            }
        });
        map.on('click', iconLayers[i].id, (e) => {
            querySelectedFeatures();
        });
        map.on('click', archiveIconLayer.id, (e) => {
            console.log('clicked on archive');
            if (e.features.length > 0) {
                console.log('clicked on archive: ', e.features[0]);
                showArchiveEntries(e.features[0].properties.id);
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

                // set popup
                let str = '';
                for (let j = 0; j < e.features.length; j++) {
                    str += e.features[j].properties.name + '<br>';
                }
                popup.setLngLat(hoveredIcon[i].geometry.coordinates).setHTML(str).addTo(map);
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

            // remove popup
            popup.remove();
        });
    }
    // add layer for multiple icons at same location
    map.addSource(multipleIconsLayer.source, {
        type: 'geojson',
        data: multipleIconSources
    });
    map.addLayer(multipleIconsLayer)

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

    map.on('dragend', () => {
        showSameLocationSources();
    });

    map.on('pitchend', () => {
        showSameLocationSources();
    });

    map.on('zoomend', () => {
        showSameLocationSources();
    });

    showSameLocationSources();

    console.log('map info added', map);
}