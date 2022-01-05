// features that are currently hovered
let selectedLib = null, selectedEntry = null; selectedRadius = null, selectedLines = [], selectedDashes = [], selectedDots = [];

// if selected is true, hover effects are locked (e.g. after clicking on an icon to display the details in the sidebar, the icon, lines etc. stay hovered)
// no other hovering effects appear on the map until selected is set to false again (e.g. by pressing the back button in the sidebar)
let selected = false;

// MAP PROPERTIES
mapboxgl.accessToken = 'pk.eyJ1IjoiZGx3LW1tbW1vIiwiYSI6ImNrcXRvZ2JuaTAwMmkzMW8zMmJlOGpveDUifQ.5XieGJGXyN1EOV0i-fDReA';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/dlw-mmmmo/ckqtp7u2f03aq18qqzaspevm8', // style URL
    center: [10, 52], // starting position [lng, lat]
    zoom: 4.8, // starting zoom
    maxBounds: [[-130, 20], [45, 70]], // map bounds
    minPitch: 0, maxPitch: 0, touchPitch: false // disable pitch
});

// POPUP THAT APPEARS ON HOVER
const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnMove: true,
    maxWidth: '200px',
    offset: 12
});

// ADD IMAGE FILES TO MAP SO THEY CAN BE USED BY LAYER PROPERTIES (in layer.js)
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

// CALLED BY IMPORT.JS AFTER ALL DATA IS IMPORTED, ADD SOURCES AND LAYERS TO MAP
function addFeatures() {
    for (let i = 0; i < entryLayers.length; i++) {
        // add radius layers
        map.addSource(radiusLayers[i].source, { type: 'geojson', data: radiusSources[i] });
        i > 0 ? map.addLayer(radiusLayers[i], radiusLayers[0].id) : map.addLayer(radiusLayers[i]);
        // add dot layers
        map.addSource(dotLayers[i].source, { type: 'geojson', data: dotSources[i] });
        i > 0 ? map.addLayer(dotLayers[i], dotLayers[0].id) : map.addLayer(dotLayers[i]);
        // add dash layers
        map.addSource(dashLayers[i].source, { type: 'geojson', data: dashSources[i] });
        i > 0 ? map.addLayer(dashLayers[i], dashLayers[0].id) : map.addLayer(dashLayers[i]);
        // add line layers
        map.addSource(lineLayers[i].source, { type: 'geojson', data: lineSources[i] });
        i > 0 ? map.addLayer(lineLayers[i], lineLayers[0].id) : map.addLayer(lineLayers[i]);
        // add entry layers
        map.addSource(entryLayers[i].source, { type: 'geojson', data: entrySources[i] });
        i > 0 ? map.addLayer(entryLayers[i], entryLayers[0].id) : map.addLayer(entryLayers[i]);
        // add entry layer events
        map.on('mousemove', entryLayers[i].id, (e) => {
            map.getCanvas().style.cursor = 'pointer';
            let s = '';
            e.features.forEach((f) => { s += f.properties.sig + '<br>' });
            popup.setLngLat(e.features[0].geometry.coordinates).setHTML(s).addTo(map); // set popup
            if (!selected && e.features.length > 0) setEntryHover(e.features[0]); // set hover states
        });
        map.on('mouseleave', entryLayers[i].id, () => {
            map.getCanvas().style.cursor = '';
            popup.remove(); // reset popup
            if (!selected) resetEntryHover(); // reset hover states
        });
        map.on('click', entryLayers[i].id, (e) => {
            if (e.features.length === 1) {
                displayEntry(e.features[0].id, ''); // if there is a single entry at this location, display entry
                prevSide = 'side-home';
            } else if (e.features.length > 1) {
                displayMultEntries(e.features, true); // if there are multiple entries at this location, display list of mult entries
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
    // add lib layer events
    map.on('mousemove', libLayer.id, (e) => {
        map.getCanvas().style.cursor = 'pointer';
        if (!selected && e.features.length > 0) setLibHover(e.features[0]); // set hover states
    });
    map.on('mouseleave', libLayer.id, () => {
        map.getCanvas().style.cursor = '';
        if (!selected) resetLibHover(); // reset hover states
    });

    map.on('click', libLayer.id, (e) => {
        if (e.features.length > 0) {
            setLibHover(e.features[0]);
            displayLibEntries(e.features[0].id, true); // display list with lib entries
        }
    });
    // after all sources and layers are added: remove loading screen
    document.getElementById('loading-screen').style.display = 'none';
    slider.addEventListener('input', setSliderValue);
    window.addEventListener('resize', setSliderValue);
    setSliderValue(); // set slider value to max position
}

function setEntryHover(e) {
    // reset hover states in case the cursor moves from one entry onto another right next to it, so 'mouseleave' does not trigger
    if (selectedEntry !== e) {
        resetEntryHover();
        resetLibHover();
    }
    selectedEntry = e; // set entry
    if (e.properties.radius > 0) selectedRadius = radiusSources[returnPrefix(e.properties.pid)].features.find(r => r.properties.pid === e.properties.pid); // set radius
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
    selectedDots.push(dotSources[returnPrefix(e.properties.pid)].features.find(d => d.properties.pid === e.properties.pid)); // push dot
    // set feature states
    map.setFeatureState({ source: entryLayers[returnPrefix(selectedEntry.properties.pid)].source, id: selectedEntry.id }, { hover: true });
    if (selectedRadius !== null) map.setFeatureState({ source: radiusLayers[returnPrefix(selectedRadius.properties.pid)].source, id: selectedRadius.id }, { hover: true });
    selectedLines.forEach((l) => { map.setFeatureState({ source: lineLayers[returnPrefix(l.properties.pid)].source, id: l.id }, { hover: true }); });
    selectedDashes.forEach((d) => { map.setFeatureState({ source: dashLayers[returnPrefix(d.properties.pid)].source, id: d.id }, { hover: true }); });
    selectedDots.forEach((d) => { map.setFeatureState({ source: dotLayers[returnPrefix(d.properties.pid)].source, id: d.id }, { hover: true }); });
    setArrows(selectedLines.concat(selectedDashes, selectedDots)); // set arrows
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
    selectedEntry = null, selectedRadius = null, selectedLines = [], selectedDashes = [], selectedDots = [];
    map.setLayoutProperty(arrowLayer.id, 'visibility', 'none'); // hide arrows
}

function setLibHover(l) {
    // reset hover in case the cursor moves from one lib onto another right next to it, so 'mouseleave' does not trigger
    if (selectedLib !== l) {
        resetEntryHover();
        resetLibHover();
    }
    selectedLib = l; // store lib id so it can be restored after hovering over an entry in the sidebar
    map.setFeatureState({ source: libLayer.source, id: l.id }, { hover: true }); // set hover for lib
    for (let i = 0; i < dotSources.length; i++) {
        dotSources[i].features.forEach((d) => {
            // only set hover if lib property of dot matches name property of lib
            if (d.properties.lib === l.properties.name) {
                selectedDots.push(d); // store dot ids so they can be restored after hovering over an entry in the sidebar
                map.setFeatureState({ source: dotLayers[i].source, id: d.id }, { hover: true }); // set hover for dots
            }
        });
    }
    setArrows(selectedDots); // set arrows
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
    selectedLib = null, selectedDots = [];
    map.setLayoutProperty(arrowLayer.id, 'visibility', 'none'); // hide arrows
}

// ARROWS ARE ONLY VISIBLE ON TOP OF HOVERED LINES
function setArrows(arr) {
    if (cbOther[2].checked) { // only show arrows when lines are not generally filtered
        const arrowSources = { type: 'FeatureCollection', features: [] }; // create gejson source
        arr.forEach((a) => {
            if (!a.properties.lib || (a.properties.lib && cbOther[0].checked)) { // only push arrows for dot sources if libs are not generally filtered
                // only push arrows for lines/dashes/dots that are not filtered by the current year, order and language settings
                if (a.properties.year <= slider.value && orders.includes(a.properties.order) && cbLang[returnPrefix(a.properties.pid)].checked) {
                    arrowSources.features.push({ type: 'Feature', geometry: { type: 'LineString', coordinates: a.geometry.coordinates } }); // push to arrow sources
                }
            }
        });
        map.getSource(arrowLayer.source).setData(arrowSources); // set data
        map.setLayoutProperty(arrowLayer.id, 'visibility', 'visible'); // show arrows
    }
}

// FIRED AFTER THE MAP IS DONE LOADING
map.on('style.load', () => {
    importData(); // import data
    addImages(); // add images to map
    map.addControl(geocoder); // add geocoder
    toggleSearch(); // hide geocoder
    map.addControl(new mapboxgl.ScaleControl({ maxWidth: 200, unit: 'metric' }), 'bottom-right'); // add scale at the bottom of the map
    map.dragRotate.disable(); // disable rotation
    map.touchZoomRotate.disableRotation();
});

// HELPER FUNCTION: CALLED BY SEVERAL FUNCTIONS TO ANIMATE THE CAMERA TO SPECIFIC COORDINATES
function setCam(c) {
    let z = map.getZoom();
    if (z < 8) z = 8; // zoom in if zoom < 8, but don't zoom out
    // start camera animation
    map.flyTo({ center: c, zoom: z });
}

// FIX: SET VIEWPORT HEIGHT FOR MOBILE DEVICES
window.addEventListener('load', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    // reset checkboxes on load
    slider.value = slider.max;
    document.querySelectorAll('input[type=checkbox]').forEach((cb) => {
        cb.checked = true;
    });
});
window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});