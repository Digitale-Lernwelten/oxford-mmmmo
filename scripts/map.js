let selectedLib = null, selectedEntry = null; selectedRadius = null, selectedLines = [], selectedDashes = [], selectedDots = [];

let selected = false;

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

const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnMove: true,
    maxWidth: '200px',
    offset: 12
});

function addImages() {
    orderIcons.forEach((icon) => {
        map.loadImage(`assets/orders/${icon}.png`, (error, data) => {
            map.addImage(icon, data, { sdf: true });
        });
    });
    mapIcons.forEach((icon) => {
        map.loadImage(`assets/map/${icon}.png`, (error, data) => {
            map.addImage(icon, data, { sdf: true });
        });
    });
}

// called by import.js after all data is imported
function addFeatures() {
    for (let i = 0; i < entryLayers.length; i++) {
        // add radius layers
        map.addSource(radiusLayers[i].source, { type: 'geojson', data: radiusSources[i] });
        map.addLayer(radiusLayers[i]);
        // add dot layers
        map.addSource(dotLayers[i].source, { type: 'geojson', data: dotSources[i] });
        map.addLayer(dotLayers[i]);
        // add dash layers
        map.addSource(dashLayers[i].source, { type: 'geojson', data: dashSources[i] });
        map.addLayer(dashLayers[i]);
        // add line layers
        map.addSource(lineLayers[i].source, { type: 'geojson', data: lineSources[i] });
        map.addLayer(lineLayers[i]);
        // add entry layers
        map.addSource(entryLayers[i].source, { type: 'geojson', data: entrySources[i] });
        map.addLayer(entryLayers[i]);
        map.on('mousemove', entryLayers[i].id, (e) => {
            map.getCanvas().style.cursor = 'pointer';
            let s = '';
            e.features.forEach((f) => { s += f.properties.sig + '<br>' });
            popup.setLngLat(e.features[0].geometry.coordinates).setHTML(s).addTo(map);
            if (!selected && e.features.length > 0) setEntryHover(e.features[0]);
        });
        map.on('mouseleave', entryLayers[i].id, () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
            if (!selected) resetEntryHover();
        });
        map.on('click', entryLayers[i].id, (e) => {
            if (e.features.length === 1) {
                displayEntry(e.features[0].id, '');
            } else if (e.features.length > 1) {
                displayMultEntries(e.features, true);
            }
        });
    }
    // add arrow layer
    map.addSource(arrowLayer.source, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    map.addLayer(arrowLayer, entryLayers[0].id);
    // add mult layer
    map.addSource(multLayer.source, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    map.addLayer(multLayer);
    // add lib layer
    map.addSource(libLayer.source, { type: 'geojson', data: libSources });
    map.addLayer(libLayer);
    map.on('mousemove', libLayer.id, (e) => {
        map.getCanvas().style.cursor = 'pointer';
        if (!selected && e.features.length > 0) setLibHover(e.features[0]);
    });
    map.on('mouseleave', libLayer.id, () => {
        map.getCanvas().style.cursor = '';
        if (!selected) resetLibHover();
    });

    map.on('click', libLayer.id, (e) => {
        if (e.features.length > 0) {
            setLibHover(e.features[0]);
            displayLibEntries(e.features[0].id, true);
        }
    });

    /*map.on('mousedown', () => {
        if (selected) {
            selected = false;
            resetEntryHover();
            resetLibHover();
        }
    });
    map.on('touchstart', () => {
        if (selected) {
            selected = false;
            resetEntryHover();
            resetLibHover();
        }
    });*/
    // remove loading screen, set slider
    document.getElementById('loading-screen').style.display = 'none';
    slider.addEventListener('input', setSliderValue);
    window.addEventListener('resize', setSliderValue);
    setSliderValue();
}

function setEntryHover(e) {
    // reset hover in case the cursor moves from one entry onto another right next to it, so 'mouseleave' does not trigger
    if (selectedEntry !== e) {
        resetEntryHover();
        resetLibHover();
    }
    // set entry
    selectedEntry = e;
    // set radius
    if (e.properties.radius > 0) selectedRadius = radiusSources[returnPrefix(e.properties.pid)].features.find(r => r.properties.pid === e.properties.pid);
    // if entry has moved, push lines that start and end at this icon
    if (isNaN(e.properties.pid.slice(-1))) {
        const me = movedEntries[e.properties.pid.substring(0, e.properties.pid.length - 1)];
        for (let i = 1; i < me.length; i++) {
            if (e.id === me[i] || e.id === me[i - 1]) {

                selectedLines.push(lineSources[returnPrefix(e.properties.pid)].features.find(l => l.properties.pid === features[me[i]].properties.pid));
            }
        }
    }
    // push dashes that start and end at this icon
    for (let i = 0; i < dashSources.length; i++) {
        dashSources[i].features.forEach((d) => { if (d.properties.pid === e.properties.pid || d.properties.origin === e.properties.pid) selectedDashes.push(d); });
    }
    // push dot
    selectedDots.push(dotSources[returnPrefix(e.properties.pid)].features.find(d => d.properties.pid === e.properties.pid));
    // set feature states
    map.setFeatureState({ source: entryLayers[returnPrefix(selectedEntry.properties.pid)].source, id: selectedEntry.id }, { hover: true });
    if (selectedRadius !== null) map.setFeatureState({ source: radiusLayers[returnPrefix(selectedRadius.properties.pid)].source, id: selectedRadius.id }, { hover: true });
    selectedLines.forEach((l) => { map.setFeatureState({ source: lineLayers[returnPrefix(l.properties.pid)].source, id: l.id }, { hover: true }); });
    selectedDashes.forEach((d) => { map.setFeatureState({ source: dashLayers[returnPrefix(d.properties.pid)].source, id: d.id }, { hover: true }); });
    selectedDots.forEach((d) => { map.setFeatureState({ source: dotLayers[returnPrefix(d.properties.pid)].source, id: d.id }, { hover: true }); });
    // set arrows
    setArrows(selectedLines.concat(selectedDashes, selectedDots));
}

function resetEntryHover() {
    // reset feature states for entries, radius, lines and dashes
    if (selectedEntry !== null) map.setFeatureState({ source: entryLayers[returnPrefix(selectedEntry.properties.pid)].source, id: selectedEntry.id }, { hover: false });
    if (selectedRadius !== null) map.setFeatureState({ source: radiusLayers[returnPrefix(selectedRadius.properties.pid)].source, id: selectedRadius.id }, { hover: false });
    if (selectedLines.length > 0) {
        selectedLines.forEach((l) => { map.setFeatureState({ source: lineLayers[returnPrefix(l.properties.pid)].source, id: l.id }, { hover: false }); });
    }
    if (selectedDashes.length > 0) {
        selectedDashes.forEach((d) => { map.setFeatureState({ source: dashLayers[returnPrefix(d.properties.pid)].source, id: d.id }, { hover: false }); });
    }
    if (selectedDots.length > 0) {
        selectedDots.forEach((d) => { map.setFeatureState({ source: dotLayers[returnPrefix(d.properties.pid)].source, id: d.id }, { hover: false }); });
    }
    // reset values
    selectedEntry = null;
    selectedRadius = null;
    selectedLines = [];
    selectedDashes = [];
    selectedDots = [];
    map.setLayoutProperty(arrowLayer.id, 'visibility', 'none');
}

function setLibHover(l) {
    // reset hover in case the cursor moves from one lib onto another right next to it, so 'mouseleave' does not trigger
    if (selectedLib !== l) {
        resetEntryHover();
        resetLibHover();
    }
    // set hover for lib
    selectedLib = l; // store lib id so it can be reset
    map.setFeatureState({ source: libLayer.source, id: l.id }, { hover: true });
    // set hover for dots
    for (let i = 0; i < dotSources.length; i++) {
        dotSources[i].features.forEach((d) => {
            // only set hover if lib property of dot matches name property of lib
            if (d.properties.lib === l.properties.name) {
                selectedDots.push(d); // store lib id so it can be reset
                map.setFeatureState({ source: dotLayers[i].source, id: d.id }, { hover: true });
            }
        });
    }
    setArrows(selectedDots);
}

function resetLibHover() {
    // reset feature states if lib and/or dots were selected
    if (selectedLib !== null) map.setFeatureState({ source: libLayer.source, id: selectedLib.id }, { hover: false });
    if (selectedDots.length > 0) {
        selectedDots.forEach((d) => {
            map.setFeatureState({ source: dotLayers[returnPrefix(d.properties.pid)].source, id: d.id }, { hover: false });
        });
    }
    // reset values
    selectedLib = null;
    selectedDots = [];
    map.setLayoutProperty(arrowLayer.id, 'visibility', 'none');
}

function setArrows(arr) {
    const arrowSources = { type: 'FeatureCollection', features: [] };
    arr.forEach((a) => {
        arrowSources.features.push({ type: 'Feature', geometry: { type: 'LineString', coordinates: a.geometry.coordinates } })
    });
    map.getSource(arrowLayer.source).setData(arrowSources);
    map.setLayoutProperty(arrowLayer.id, 'visibility', 'visible');
}

map.on('style.load', () => {
    importData();
    addImages();
    map.addControl(geocoder);
    map.addControl(new mapboxgl.ScaleControl({ maxWidth: 200, unit: 'metric' }), 'bottom-right');
    toggleSearch(); // hide geocoder
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
});


function setCam(c) {
    // zoom in if zoom < 8, but don't zoom out
    let z = map.getZoom();
    if (z < 8) z = 8;
    // start camera animation
    map.flyTo({ center: c, zoom: z });
}