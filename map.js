const slider = document.getElementById('slider');
const sliderValue = document.getElementById('slider-value');

const btnLanguage = document.getElementById('btn-language');
const btnOrder = document.getElementById('btn-order');
const btnFilter = document.getElementById('btn-filter');

const selectLanguage = document.getElementById('select-language');
const selectOrder = document.getElementById('select-order');
const selectFilter = document.getElementById('select-filter');

const checkboxOD = document.getElementById('checkbox-od');
const checkboxMD = document.getElementById('checkbox-md');
const checkboxND = document.getElementById('checkbox-nd');
const checkboxLT = document.getElementById('checkbox-lt');
const checkboxFR = document.getElementById('checkbox-fr');
const checkboxesLang = [checkboxOD, checkboxMD, checkboxND, checkboxLT, checkboxFR];

const checkboxBorders = document.getElementById('checkbox-borders');
const checkboxNames = document.getElementById('checkbox-names');
const checkboxRadius = document.getElementById('checkbox-radius');
const checkboxLines = document.getElementById('checkbox-lines');

let orders = ['Augustiner', 'Benediktiner', 'Dominikaner', 'Franziskaner', 'Jesuiten', 'Kartäuser', 'Zisterzienser', 'Privatbesitz', 'Sonstiger Orden', 'Unbekannter Orden'];

let filterYear = ['>=', ['to-number', slider.value], ['to-number', ['get', 'year']]];
let filterOrder = ['in', ['get', 'order'], ['literal', orders]];
let filters = ['all', filterYear, filterOrder];

let currentBorderLayers = borderLayers;
let currentNameLayers = stateNameLayers.concat(otherNameLayers);

mapboxgl.accessToken = 'pk.eyJ1IjoiZGx3LW1tbW1vIiwiYSI6ImNrcXRvZ2JuaTAwMmkzMW8zMmJlOGpveDUifQ.5XieGJGXyN1EOV0i-fDReA';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/dlw-mmmmo/ckqtp7u2f03aq18qqzaspevm8', // style URL
    center: [10, 52], // starting position [lng, lat]
    zoom: 4.8 // starting zoom
});

map.on('style.load', () => {
    console.log("map object: ", map);
    ImportData();
    AddIconImages();
});
map.on('click', function (e) {
    let features = map.queryRenderedFeatures(e.point, {
        layers: iconLayers
    });
    if (!features.length) {
        return;
    }
    let feature = features[0];
    ShowFeatureInfo(feature.properties.name, feature.properties.year, feature.properties.category, feature.properties.description);
});

function AddIconImages() {
    orderIcons.forEach((icon) => {
        map.loadImage('assets/' + icon + '.png', (error, imgData) => {
            if (error) throw error;
            map.addImage(icon, imgData, {
                sdf: true
            });
        });
    });
    map.loadImage('assets/line.png', (error, imgData) => {
        if (error) throw error;
        map.addImage ('line', imgData);
    });
    map.loadImage('assets/dash.png', (error, imgData) => {
        if (error) throw error;
        map.addImage ('dash', imgData);
    });
}

function AddMapInfo() {
    console.log('add map info');

    // add icon layers
    for (let i = 0; i < iconLayers.length; i++) {
        map.addSource(iconLayers[i].source, {
            type: 'geojson',
            data: iconSources[i]
        });
        map.addLayer(iconLayers[i]);
        map.on('mousemove', iconLayers[i].id, (e) => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', iconLayers[i].id, (e) => {
            map.getCanvas().style.cursor = '';
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
        console.log('add circle source', circleSources[i]);
        map.addLayer(circleLayers[i], iconLayers[i].id);

        console.log('add circle layer', circleLayers[i]);
    }

    // add line layers
    for (let i = 0; i < lineLayers.length; i++) {
        map.addSource(lineLayers[i].source, {
            type: 'geojson',
            data: lineSources[i]
        });
        map.addLayer(lineLayers[i], circleLayers[i].id);
    }

    // add dash layers
    for (let i = 0; i < dashLayers.length; i++) {
        map.addSource(dashLayers[i].source, {
            type: 'geojson',
            lineMetrics: true,
            data: dashSources[i]
        });
        map.addLayer(dashLayers[i], lineLayers[i].id);
    }
    console.log('map info added');
}

function UpdateYear() {
    UpdateBorderLayers(checkboxBorders.checked);
    UpdateNameLayers(checkboxNames.checked);
    filterYear = ['>=', ['to-number', slider.value], ['to-number', ['get', 'year']]];
    UpdateIconFilters();
}

function UpdateIconFilters() {
    console.log(map.getSource('data-icons-nd'));
    iconLayers.forEach((layer) => {
        map.setFilter(layer.id, ['all', filterYear, filterOrder]);
    });
    UpdateCircleFilters();
    UpdateLineFilters();
}

function UpdateCircleFilters() {
    circleLayers.forEach((layer) => {
        map.setFilter(layer.id, ['all', filterYear, filterOrder]);
    });
}

function UpdateLineFilters() {
    lineLayers.forEach((layer) => {
        map.setFilter(layer.id, ['all', filterYear, filterOrder]);
    });
    dashLayers.forEach((layer) => {
        map.setFilter(layer.id, ['all', filterYear, filterOrder]);
    });
}

function UpdateLanguage(value, checked) {
    if (checked) {
        map.setLayoutProperty('layer-icons-' + value, 'visibility', 'visible');
        if (checkboxRadius.checked) {
            map.setLayoutProperty('layer-circles-' + value, 'visibility', 'visible');
        }
        if (checkboxLines.checked) {
            map.setLayoutProperty('layer-lines-'+ value, 'visibility', 'visible');
            map.setLayoutProperty('layer-dashes-'+ value, 'visibility', 'visible');
        }
    } else {
        map.setLayoutProperty('layer-icons-' + value, 'visibility', 'none');
        map.setLayoutProperty('layer-circles-' + value, 'visibility', 'none');
        map.setLayoutProperty('layer-lines-' + value, 'visibility', 'none');
        map.setLayoutProperty('layer-dashes-' + value, 'visibility', 'none');
    }
}

function UpdateOrder(value, checked) {
    if (checked) {
        if (!orders.includes(value)) {
            orders.push(value);
        }
    } else {
        orders = orders.filter(item => item !== value);
    }
    filterOrder = ['in', ['get', 'order'], ['literal', orders]];
    UpdateIconFilters();
}

function UpdateNameLayers(checked) {
    currentNameLayers.forEach((layer) => { map.setLayoutProperty(layer, 'visibility', 'none') });
    if (slider.value === slider.max) {
        currentNameLayers = stateNameLayers.concat(otherNameLayers);
    } else {
        historicalMaps.forEach((year) => {
            if (year < slider.value) {
                currentNameLayers = ['world-' + year + '-names'].concat(otherNameLayers);
            } else {
                return;
            }
        });
    } if (checked) {
        currentNameLayers.forEach((layer) => { map.setLayoutProperty(layer, 'visibility', 'visible') });
    }
}

function UpdateBorderLayers(checked) {
    currentBorderLayers.forEach((layer) => { map.setLayoutProperty(layer, 'visibility', 'none') });
    if (slider.value === slider.max) {
        currentBorderLayers = borderLayers;
    } else {
        historicalMaps.forEach((year) => {
            if (year < slider.value) {
                currentBorderLayers = ['world-' + year + '-lines'];
            } else {
                return;
            }
        });
    }
    if (checked) {
        currentBorderLayers.forEach((layer) => { map.setLayoutProperty(layer, 'visibility', 'visible') });
    }
}

function UpdateInfrastructureLayers(checked) {
    if (checked) {
        infrastructureLayers.forEach((layer) => { map.setLayoutProperty(layer, 'visibility', 'visible') });
    } else {
        infrastructureLayers.forEach((layer) => { map.setLayoutProperty(layer, 'visibility', 'none') });
    }
}

function UpdateCircleLayers(checked) {
    if (checked) {
        for (let i = 0; i < circleLayers.length; i++) {
            if (checkboxesLang[i].checked) {
                map.setLayoutProperty(circleLayers[i].id, 'visibility', 'visible');
            }
        }
    } else {
        circleLayers.forEach((layer) => { map.setLayoutProperty(layer.id, 'visibility', 'none') });
    }
}

function UpdateLineLayers(checked) {
    if (checked) {
        for (let i = 0; i < lineLayers.length; i++) {
            if (checkboxesLang[i].checked) {
                map.setLayoutProperty(lineLayers[i].id, 'visibility', 'visible');
                map.setLayoutProperty(dashLayers[i].id, 'visibility', 'visible');
            }
        }
    } else {
        lineLayers.forEach((layer) => { map.setLayoutProperty(layer.id, 'visibility', 'none') });
        dashLayers.forEach((layer) => { map.setLayoutProperty(layer.id, 'visibility', 'none') });
    }
}

// called by btn-language: toggle fieldset to select languages
function ToggleLanguageList() {
    // if fieldset is displayed, hide it
    if (selectLanguage.style.display === 'flex') {
        selectLanguage.style.display = 'none';
    }
    // if it is hidden, display it and hide other fieldsets
    else {
        selectLanguage.style.display = 'flex';
        selectOrder.style.display = 'none';
        selectFilter.style.display = 'none';
    }
}

// called by btn-order: toggle fieldset to select orders
function ToggleOrderList() {
    // if fieldset is displayed, hide it
    if (selectOrder.style.display === 'flex') {
        selectOrder.style.display = 'none';
    }
    // if it is hidden, display it and hide other fieldsets
    else {
        selectOrder.style.display = 'flex';
        selectLanguage.style.display = 'none';
        selectFilter.style.display = 'none';
    }
}

// called by btn-filter: toggle fieldset to select additional filter options
function ToggleFilterList() {
    // if fieldset is displayed, hide it
    if (selectFilter.style.display === 'flex') {
        selectFilter.style.display = 'none';
    }
    // if it is hidden, display it and hide other fieldsets
    else {
        selectFilter.style.display = 'flex';
        selectOrder.style.display = 'none';
        selectLanguage.style.display = 'none';
    }
}

const val = ((slider.value - slider.min) / slider.step) * (slider.offsetWidth / ((slider.max - slider.min) / slider.step));
sliderValue.style.left = `${val}px`;
slider.addEventListener('input', setSliderValue);

// called by slider input: set position and text for the slider output, update markers
function setSliderValue() {
    // set position
    const val = ((slider.value - slider.min) / slider.step) * (slider.offsetWidth / ((slider.max - slider.min) / slider.step));
    sliderValue.style.left = `${val}px`;
    // set text
    if (slider.value === slider.max) {
        sliderValue.innerHTML = 'Heute';
    } else {
        sliderValue.innerHTML = slider.value;
    }
    // update markers on map
    UpdateYear();
}

// prevent fieldsets from closing when clicking on a checkbox, because they are children of the toggle buttons
function StopPropagation() {
    // get fieldsets by class
    let fieldsets = document.querySelectorAll('.select-field');
    fieldsets.forEach((fieldset) => {
        // stop propagation for each fieldset
        fieldset.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}

StopPropagation();