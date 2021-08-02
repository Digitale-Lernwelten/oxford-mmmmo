const sideHome = document.getElementById('side-home');
const sideManuscripts = document.getElementById('side-manuscripts');
const sideMechthild = document.getElementById('side-mechthild');
const sideControls = document.getElementById('side-controls');
const sideInfo = document.getElementById('side-info');
const sidePanels = [sideHome, sideManuscripts, sideMechthild, sideControls, sideInfo];

const navHome = document.getElementById('nav-home');
const navManuscripts = document.getElementById('nav-manuscripts');
const navMechthild = document.getElementById('nav-mechthild');
const navControls = document.getElementById('nav-controls');
const navElements = [navHome, navManuscripts, navMechthild, navControls];

const slider = document.getElementById('slider');
const sliderValue = document.getElementById('slider-value');

const btnLanguage = document.getElementById('btn-language');
const btnOrder = document.getElementById('btn-order');
const btnFilter = document.getElementById('btn-filter');
const selectLanguage = document.getElementById('select-language');
const selectOrder = document.getElementById('select-order');
const selectFilter = document.getElementById('select-filter');

let orders = ['Augustiner', 'Benediktiner', 'Dominikaner', 'Franziskaner', 'Jesuiten', 'Kartäuser', 'Zisterzienser', 'Privatbesitz', 'Sonstige Orden', 'Unbekannt'];
let filterYear = [];
let filterOrder = ['in', ['get', 'order'], ['literal', orders]];
let filters = ['all', filterYear, filterOrder];

var iconFeatures = [];
const iconLayers = ['icons-ob', 'icons-nm', 'icons-lt', 'icons-fr'];

const stateNameLayers = ['country-label', 'state-label'];
const otherNameLayers = ['natural-line-label', 'natural-point-label', 'poi-label', 'settlement-major-label', 'settlement-minor-label', 'settlement-subdivision-label', 'water-point-label', 'waterway-label'];
const borderLayers = ['admin-0-boundary', 'admin-0-boundary-bg', 'admin-0-boundary-disputed', 'admin-1-boundary', 'admin-1-boundary-bg'];
const infrastructureLayers = ['aeroway-line', 'aeroway-polygon', 'bridge-major-link', 'bridge-major-link-case', 'bridge-major-link-2', 'bridge-major-link-2-case', 'bridge-motorway-trunk', 'bridge-motorway-trunk-case', 'bridge-motorway-trunk-2', 'bridge-motorway-trunk-2-case',
    'bridge-primary-secondary-tertiary', 'bridge-primary-secondary-tertiary-case', 'bridge-rail', 'bridge-street-minor', 'bridge-street-minor-case', 'bridge-street-minor-low', 'building', 'building-outline', 'road-intersection', 'road-major-link', 'road-major-link-case',
    'road-minor', 'road-minor-case', 'road-minor-low', 'road-motorway-trunk', 'road-motorway-trunk-case', 'road-primary', 'road-primary-case', 'road-rail', 'road-secondary-tertiary', 'road-secondary-tertiary-case', 'road-street', 'road-street-case', 'road-street-low', 'tunnel-major-link',
    'tunnel-major-link-case', 'tunnel-motorway-trunk', 'tunnel-motorway-trunk-case', 'tunnel-primary-secondary-tertiary', 'tunnel-primary-secondary-tertiary-case', 'tunnel-street-minor', 'tunnel-street-minor-case', 'tunnel-street-minor-low', 'waterway', 'waterway-shadow'];
const historicalMaps = [1279, 1492, 1530, 1650, 1715, 1783];
var currentBorderLayers = borderLayers;
var currentNameLayers = stateNameLayers.concat(otherNameLayers);

const checkboxBorders = document.getElementById('checkbox-borders');
const checkboxNames = document.getElementById('checkbox-names');

mapboxgl.accessToken = 'pk.eyJ1IjoiZGx3LW1tbW1vIiwiYSI6ImNrcXRvZ2JuaTAwMmkzMW8zMmJlOGpveDUifQ.5XieGJGXyN1EOV0i-fDReA';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/dlw-mmmmo/ckqtp7u2f03aq18qqzaspevm8', // style URL
    center: [10, 52], // starting position [lng, lat]
    zoom: 4.8 // starting zoom
});

map.on('load', () => {
    console.log(map);
    iconFeatures = QueryIcons();
    UpdateYear();
    SetMarkerEvents();
});

function SetMarkerEvents() {
    iconLayers.forEach((layer) => {
        map.on('mousemove', layer, (e) => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', layer, (e) => {
            map.getCanvas().style.cursor = '';
        })
    });
}
map.on('click', function (e) {
    let features = map.queryRenderedFeatures(e.point, {
        layers: iconLayers
    });
    if (!features.length) {
        return;
    }
    let feature = features[0];

    sideHome.style.display = "none";
    sideInfo.style.display = "block";
    document.getElementById('feature-name').innerHTML = feature.properties.name;
    document.getElementById('feature-year').innerHTML = feature.properties.year;
    document.getElementById('feature-category').innerHTML = feature.properties.category;
    document.getElementById('feature-description').innerHTML = feature.properties.description;
});

function backToHome() {
    sideInfo.style.display = "none";
    sideHome.style.display = "block";
}

function NavControls(value) {
    sideInfo.style.display = 'none';
    for (let i=  0; i < navElements.length; i++) {
        navElements[i].style.borderBottomColor = 'white';
        sidePanels[i].style.display = 'none';
        if (navElements[i] === value) {
            navElements[i].style.borderBottomColor = '#2772d7';
            sidePanels[i].style.display = 'block';
        }
    }
}

function QueryIcons() {
    const iconsOB = map.querySourceFeatures('composite', { sourceLayer: 'MMMMO_Geospatial_Data_-_Oberdeut' });
    const iconsNM = map.querySourceFeatures('composite', { sourceLayer: 'MMMMO_Geospatial_Data_-_Nieder-M' });
    const iconsLT = map.querySourceFeatures('composite', { sourceLayer: 'MMMMO_Geospatial_Data_-_Latein' });
    const iconsFR = map.querySourceFeatures('composite', { sourceLayer: 'MMMMO_Geospatial_Data_-_Fremdspr' });
    return iconsOB.concat(iconsNM, iconsLT, iconsFR);
}

function UpdateYear() {
    UpdateBorderLayers(checkboxBorders.checked);
    UpdateNameLayers(checkboxNames.checked);
    filterYear = ['>=', ['to-number', slider.value], ['to-number', ['get', 'year']]];
    UpdateFilters();
}

function UpdateFilters() {
    const iconLayers = ['icons-ob', 'icons-nm', 'icons-lt', 'icons-fr'];
    iconLayers.forEach((layer) => {
        map.setFilter(layer, ['all', filterYear, filterOrder]);
    });
}

function UpdateLanguage(value, checked) {
    checked ? map.setLayoutProperty(value, 'visibility', 'visible') : map.setLayoutProperty(value, 'visibility', 'none');
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
    UpdateFilters();
}

function UpdateNameLayers(checked) {
    //checked ? nameLayers.forEach((layer) => {map.setLayoutProperty(layer, 'visibility', 'visible')}) : nameLayers.forEach((layer) => {map.setLayoutProperty(layer, 'visibility', 'none')});
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

// called by slider input: set position and text for the slider output, update markers
function setSliderValue() {
    // set position
    const val = ((slider.value - slider.min) / slider.step) * (slider.offsetWidth / ((slider.max - slider.min) / slider.step))
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

window.addEventListener('load', setSliderValue);
slider.addEventListener('input', setSliderValue);


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