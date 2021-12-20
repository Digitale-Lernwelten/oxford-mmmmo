const cbLang = [document.getElementById('cb-od'), document.getElementById('cb-md'), document.getElementById('cb-nd'), document.getElementById('cb-lt'), document.getElementById('cb-fr')]; // language checkboxes
const cbOther = [document.getElementById('cb-lib'), document.getElementById('cb-radius'), document.getElementById('cb-line'), document.getElementById('cb-label'), document.getElementById('cb-border')]; // other checkboxes
const fieldsets = document.querySelectorAll('.select-field');
const slider = document.getElementById('slider-range');

let orders = ['Augustiner', 'Benediktiner', 'Dominikaner', 'Franziskaner', 'Kartäuser', 'Klarissen', 'Kreuzherren', 'Zisterzienser', 'Sonstiges', 'Unbekannt']; // orders that are currently displayed
let currentLabels = slLayers.concat(olLayers), currentBorders = borderLayers; // current labels and borders, set when the slider value changes
let invMult = [];

// filters are static and do not react to any changes made to their values (e.g. slider.value, orders)
// that is why filters are stores as variables and get reapplied after every change of year or orders
let filterYear = ['>=', ['to-number', slider.value], ['to-number', ['get', 'year']]];
let filterOrder = ['in', ['get', 'order'], ['literal', orders]];

// UPDATE YEAR (by setting slider value)
function updateYear() {
    updateLabel(cbOther[3].checked); // set labels
    updateBorder(cbOther[4].checked); // set borders
    filterYear = ['>=', ['to-number', slider.value], ['to-number', ['get', 'year']]]; // set filter
    updateFilters(); // update filters on layers
}

// UPDATE ORDER (by toggling checkboxes in taskbar)
function updateOrder(val, checked) {
    if (checked) {
        if (!orders.includes(val)) orders.push(val); // if the order was checked, push it to the array
    } else {
        orders = orders.filter(o => o !== val); // if the order was unchecked, remove it from the array
    }
    filterOrder = ['in', ['get', 'order'], ['literal', orders]]; // set filter
    updateFilters(); // update filters on layers
}

// UPDATE LANGUAGE (by toggling checkboxes in taskbar)
function updateLang(val, checked) {
    if (checked) { // set layers visible
        map.setLayoutProperty(`el-${val}`, 'visibility', 'visible'); // entries
        if (cbOther[1].checked) map.setLayoutProperty(`rl-${val}`, 'visibility', 'visible'); // radius
        if (cbOther[2].checked) {
            map.setLayoutProperty(`lil-${val}`, 'visibility', 'visible'); // lines
            map.setLayoutProperty(`dal-${val}`, 'visibility', 'visible'); // dashes
            if (cbOther[0].checked) map.setLayoutProperty(`rl-${val}`, 'visibility', 'visible'); // dots
        }
    } else {
        map.setLayoutProperty(`el-${val}`, 'visibility', 'none'); // entries
        map.setLayoutProperty(`rl-${val}`, 'visibility', 'none'); // radius
        map.setLayoutProperty(`lil-${val}`, 'visibility', 'none'); // lines
        map.setLayoutProperty(`dal-${val}`, 'visibility', 'none'); // dashes
        map.setLayoutProperty(`dol-${val}`, 'visibility', 'none'); // dots
    }
    displayMultIcon(); // check if there are multiple icons at the same location
}

// UPDATE FILTERS ON LAYERS (AFTER SETTING filterYear or filterOrder)
function updateFilters() {
    for (let i = 0; i < entryLayers.length; i++) {
        map.setFilter(entryLayers[i].id, ['all', filterYear, filterOrder]);
        map.setFilter(radiusLayers[i].id, ['all', filterYear, filterOrder]);
        map.setFilter(lineLayers[i].id, ['all', filterYear, filterOrder]);
        map.setFilter(dashLayers[i].id, ['all', filterYear, filterOrder]);
        map.setFilter(dotLayers[i].id, ['all', filterYear, filterOrder]);
    }
    displayMultIcon(); // check if there are multiple icons at the same location
}

// SET SMALL ICONS ON TOP OF ENTRIES IF THERE ARE MULTIPLE ENTRIES AT THE SAME LOCATION
function displayMultIcon() {
    // updating active side after updating filters to grey out the correct entries (not related to mult icons, but implemented here to save an extra function call)
    switch (activeSide) {
        case 'side-entries': displayEntries(); break;
        case 'side-lib': displayLibEntries(selectedLibSide, false); break;
        case 'side-mult': displayMultEntries(selectedMultSide, false); break;
        default: break;
    }
    // reset invisible icons
    invMult.forEach((im) => {
        map.setFeatureState({ source: entryLayers[returnPrefix(features[im].properties.pid)].source, id: im }, { mult: false });
    });
    const multSources = { type: 'FeatureCollection', features: [] }; // create geojson source
    multEntries.forEach((multArray) => { // multArray contains all potential same location entries (entries with the same location, but not regarding if they are currently displayed)
        let cm = [];
        for (let i = 0; i < multArray.length; i++) {
            if (features[multArray[i]].properties.year <= slider.value && orders.includes(features[multArray[i]].properties.order) && cbLang[returnPrefix(features[multArray[i]].properties.pid)].checked) {
                cm.push(multArray[i]); // push entry if it is currently displayed (regarding year, order and language filters)
            }
        }
        if (cm.length > 1) {
            // if there is more than one displayed entry at the same location, push feature to geojson source
            multSources.features.push({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: features[multArray[0]].geometry.coordinates }
            });
            // make all entries at the same location invisible (by setting feature state to mult) except one, so the opacity does not change by overlapping icons
            for (let i = 1; i < cm.length; i++) {
                map.setFeatureState({ source: entryLayers[returnPrefix(features[cm[i]].properties.pid)].source, id: cm[i] }, { mult: true });
                invMult.push(cm[i]); // store invisible icons, so the feature state can later be reverted
            }
        }
    });
    map.getSource(multLayer.source).setData(multSources); // set data
}

// UPDATE LIB (by toggling checkbox in taskbar)
function updateLib(checked) {
    if (checked) {
        map.setLayoutProperty(libLayer.id, 'visibility', 'visible'); // set libs visible
        if (cbOther[2].checked) { // if checkbox for lines is also checked, set dots visible
            for (let i = 0; i < dotLayers.length; i++) {
                if (cbLang[i].checked) map.setLayoutProperty(dotLayers[i].id, 'visibility', 'visible');
            }
        }
    } else {
        map.setLayoutProperty(libLayer.id, 'visibility', 'none'); // hide libs
        dotLayers.forEach((l) => { map.setLayoutProperty(l.id, 'visibility', 'none') }); // hide dots
    }
}

// UPDATE RADIUS (by toggling checkbox in taskbar)
function updateRadius(checked) {
    if (checked) {
        for (let i = 0; i < radiusLayers.length; i++) {
            if (cbLang[i].checked) {
                map.setLayoutProperty(radiusLayers[i].id, 'visibility', 'visible'); // set visible
            }
        }
    } else {
        radiusLayers.forEach((l) => { map.setLayoutProperty(l.id, 'visibility', 'none') }); // hide
    }
}

// UPDATE LINES/DASHES/DOTS (by toggling checkbox in taskbar)
function updateLine(checked) {
    if (checked) {
        for (let i = 0; i < lineLayers.length; i++) {
            if (cbLang[i].checked) {
                map.setLayoutProperty(lineLayers[i].id, 'visibility', 'visible'); // set lines visible
                map.setLayoutProperty(dashLayers[i].id, 'visibility', 'visible'); // set dashes visible
                if (cbOther[0].checked) map.setLayoutProperty(dotLayers[i].id, 'visibility', 'visible'); // only set dots visible, if libs are checked too
            }
        }
    } else {
        for (let i = 0; i < lineLayers.length; i++) {
            map.setLayoutProperty(lineLayers[i].id, 'visibility', 'none'); // hide lines
            map.setLayoutProperty(dashLayers[i].id, 'visibility', 'none'); // hide dashes
            map.setLayoutProperty(dotLayers[i].id, 'visibility', 'none'); // hide dots
        }
    }
}

// UPDATE LABELS (by toggling checkbox in taskbar or changing the slider value)
function updateLabel(checked) {
    currentLabels.forEach((l) => { map.setLayoutProperty(l, 'visibility', 'none') }); // hide all labels
    if (slider.value === slider.max) {
        currentLabels = slLayers.concat(olLayers); // if slider value is max (today), show default mapbox layers
    } else {
        histMaps.forEach((year) => {
            // else show most recent historical map layers (+ mapbox labels that are not on state or country level)
            if (year < slider.value) {
                currentLabels = ['world-' + year + '-labels'].concat(olLayers);
            } else {
                return;
            }
        });
    }
    if (checked) {
        currentLabels.forEach((l) => { map.setLayoutProperty(l, 'visibility', 'visible') }); // if checked, set layers visible
    }
}

// UPDATE BORDERS (by toggling checkbox in taskbar or changing the slider value)
function updateBorder(checked) {
    currentBorders.forEach((l) => { map.setLayoutProperty(l, 'visibility', 'none') }); // hide all borders
    if (slider.value === slider.max) {
        currentBorders = borderLayers; // if slider value is max (today), show default mapbox layers
    } else {
        histMaps.forEach((year) => {
            if (year < slider.value) {
                currentBorders = ['world-' + year + '-lines']; // else show most recent historical map layers
            } else {
                return;
            }
        });
    }
    if (checked) {
        currentBorders.forEach((l) => { map.setLayoutProperty(l, 'visibility', 'visible') }); // if checked, set layers visible
    }
}

// UPDATE INFRASTRUCTURE (by toggling checkbox in taskbar)
function updateInf(checked) {
    if (checked) {
        infLayers.forEach((l) => { map.setLayoutProperty(l, 'visibility', 'visible') }); // set visible
    } else {
        infLayers.forEach((l) => { map.setLayoutProperty(l, 'visibility', 'none') }); // hide
    }
}

// TOGGLE SEARCH (by clicking on the search icon in taskbar)
function toggleSearch() {
    fieldsets.forEach((f) => { f.style.display = 'none' }); // hide other fieldsets
    const gd = document.querySelector('.mapboxgl-ctrl-geocoder');
    gd.style.display === 'none' ? gd.style.display = 'block' : gd.style.display = 'none'; // toggle search field
}

// TOGGLE FIELDSET (by clicking on icons in taskbar)
function toggleFieldset(s) {
    document.querySelector('.mapboxgl-ctrl-geocoder').style.display = 'none'; // hide search field
    const fs = document.getElementById(s);
    const fd = fs.style.display; // store current display in temporary variable before hiding all fieldsets, so it can be toggled
    fieldsets.forEach((f) => { f.style.display = 'none' }); // hide fieldsets
    if (fd !== 'flex') fs.style.display = 'flex'; // toggle this fieldset
}

// SET POSITION AND TEXT FOR SLIDER OUTPUT, UPDATE YEAR
function setSliderValue() {
    const sliderValue = document.getElementById('slider-value');
    const val = ((slider.value - slider.min) / slider.step) * (slider.offsetWidth / ((slider.max - slider.min) / slider.step)); // set position
    sliderValue.style.left = `${val}px`;
    slider.value === slider.max ? sliderValue.innerHTML = 'Heute' : sliderValue.innerHTML = slider.value; // set text
    updateYear(); // update displayed entries, labels and borders
}

// prevent fieldsets from closing when clicking on a checkbox
function stopFieldsetPropagation() {
    fieldsets.forEach((f) => {
        f.addEventListener('click', (e) => e.stopPropagation()); // stop propagation for each fieldset
    });
}

stopFieldsetPropagation();

// reset hover when clicking on the taskbar
document.getElementById('taskbar').addEventListener('mousedown', () => {
    resetEntryHover();
    resetLibHover();
});