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

let orders = ['Augustiner', 'Benediktiner', 'Dominikaner', 'Franziskaner', 'Kartäuser', 'Kreuzherren', 'Zisterzienser', 'Sonstiges', 'Unbekannt'];

let filterYear = ['>=', ['to-number', slider.value], ['to-number', ['get', 'year']]];
let filterOrder = ['in', ['get', 'order'], ['literal', orders]];
let filters = ['all', filterYear, filterOrder];

let currentBorderLayers = borderLayers;
let currentNameLayers = stateNameLayers.concat(otherNameLayers);

function UpdateYear() {
    UpdateBorderLayers(checkboxBorders.checked);
    UpdateNameLayers(checkboxNames.checked);
    filterYear = ['>=', ['to-number', slider.value], ['to-number', ['get', 'year']]];
    const checkVisibility = map.getLayoutProperty(archiveIconLayer.id, 'visibility');
    if (slider.value === slider.max && checkVisibility === 'none') {
        for (let i = 0; i < iconLayers.length; i++) {
            map.setPaintProperty(iconLayers[i].id, 'icon-opacity', ['case', ['boolean', ['feature-state', 'hover'], false], 1, ['boolean', ['feature-state', 'selected'], false], 1, 0.3]);
            map.setPaintProperty(circleLayers[i].id, 'fill-opacity', ['case', ['boolean', ['feature-state', 'hover'], false], 0.2, ['boolean', ['feature-state', 'selected'], false], 0.2, 0.05]);
            map.setPaintProperty(lineLayers[i].id, 'line-opacity', ['case', ['boolean', ['feature-state', 'hover'], false], 0.6, ['boolean', ['feature-state', 'selected'], false], 0.6, 0.1]);
            map.setPaintProperty(dashLayers[i].id, 'line-opacity', ['case', ['boolean', ['feature-state', 'hover'], false], 0.6, ['boolean', ['feature-state', 'selected'], false], 0.6, 0.1]);
            map.setPaintProperty(archiveLineLayers[i].id, 'line-opacity', ['case', ['boolean', ['feature-state', 'hover'], false], 0.6, ['boolean', ['feature-state', 'selected'], false], 0.6, 0.3]);
        }
        map.setLayoutProperty(archiveIconLayer.id, 'visibility', 'visible');
    } else if (slider.value !== slider.max && checkVisibility === 'visible') {
        for (let i = 0; i < iconLayers.length; i++) {
            map.setPaintProperty(iconLayers[i].id, 'icon-opacity', ['case', ['boolean', ['feature-state', 'hover'], false], 1, ['boolean', ['feature-state', 'selected'], false], 1, 0.6]);
            map.setPaintProperty(circleLayers[i].id, 'fill-opacity', ['case', ['boolean', ['feature-state', 'hover'], false], 0.2, ['boolean', ['feature-state', 'selected'], false], 0.2, 0.1]);
            map.setPaintProperty(lineLayers[i].id, 'line-opacity', ['case', ['boolean', ['feature-state', 'hover'], false], 0.6, ['boolean', ['feature-state', 'selected'], false], 0.6, 0.3]);
            map.setPaintProperty(dashLayers[i].id, 'line-opacity', ['case', ['boolean', ['feature-state', 'hover'], false], 0.6, ['boolean', ['feature-state', 'selected'], false], 0.6, 0.3]);
            map.setPaintProperty(archiveLineLayers[i].id, 'line-opacity', 0);
        }
        map.setLayoutProperty(archiveIconLayer.id, 'visibility', 'none');
    }
    UpdateFilters();
}

function UpdateFilters() {
    iconLayers.forEach((layer) => {
        map.setFilter(layer.id, ['all', filterYear, filterOrder]);
    });
    for (let i = 0; i < iconLayers.length; i++) {
        map.setFilter(iconLayers[i].id, ['all', filterYear, filterOrder]);
        map.setFilter(circleLayers[i].id, ['all', filterYear, filterOrder]);
        map.setFilter(lineLayers[i].id, ['all', filterYear, filterOrder]);
        map.setFilter(dashLayers[i].id, ['all', filterYear, filterOrder]);
        map.setFilter(archiveLineLayers[i].id, filterOrder);
    }

    // if entries in the sidebar are currently shown, update which entries are currently visible
    if (document.getElementById('side-entries').style.display === 'block') {
        showActiveEntries();
    }
}

function UpdateLanguage(value, checked) {
    if (checked) {
        map.setLayoutProperty('layer-icons-' + value, 'visibility', 'visible');
        if (checkboxRadius.checked) {
            map.setLayoutProperty('layer-circles-' + value, 'visibility', 'visible');
        }
        if (checkboxLines.checked) {
            map.setLayoutProperty('layer-lines-' + value, 'visibility', 'visible');
            map.setLayoutProperty('layer-dashes-' + value, 'visibility', 'visible');
            map.setLayoutProperty('layer-archive-lines-' + value, 'visibility', 'visible');
        }
    } else {
        map.setLayoutProperty('layer-icons-' + value, 'visibility', 'none');
        map.setLayoutProperty('layer-circles-' + value, 'visibility', 'none');
        map.setLayoutProperty('layer-lines-' + value, 'visibility', 'none');
        map.setLayoutProperty('layer-dashes-' + value, 'visibility', 'none');
        map.setLayoutProperty('layer-archive-lines-' + value, 'visibility', 'none');
    }

    // if entries in the sidebar are currently shown, update which entries are currently visible
    if (document.getElementById('side-entries').style.display === 'block') {
        showActiveEntries();
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
    UpdateFilters();
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
                map.setLayoutProperty(archiveLineLayers[i].id, 'visibility', 'visible');
            }
        }
    } else {
        lineLayers.forEach((layer) => { map.setLayoutProperty(layer.id, 'visibility', 'none') });
        dashLayers.forEach((layer) => { map.setLayoutProperty(layer.id, 'visibility', 'none') });
        archiveLineLayers.forEach((layer) => { map.setLayoutProperty(layer.id, 'visibility', 'none') });
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