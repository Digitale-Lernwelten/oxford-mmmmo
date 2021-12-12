const cbLang = [document.getElementById('cb-od'), document.getElementById('cb-md'), document.getElementById('cb-nd'), document.getElementById('cb-lt'), document.getElementById('cb-fr')];
const cbOther = [document.getElementById('cb-lib'), document.getElementById('cb-radius'), document.getElementById('cb-line'), document.getElementById('cb-label'), document.getElementById('cb-border')];
const fieldsets = document.querySelectorAll('.select-field');

const slider = document.getElementById('slider-range');

let orders = ['Augustiner', 'Benediktiner', 'Dominikaner', 'Franziskaner', 'Kartäuser', 'Klarissen', 'Kreuzherren', 'Zisterzienser', 'Sonstiges', 'Unbekannt'];
let currentLabels = slLayers.concat(olLayers), currentBorders = borderLayers;
let invMult = [];

// filters are static and do not react to any changes made to their values (e.g. slider.value, orders)
// that is why filters are stores as variables and get reapplied after every change of year or orders
let filterYear = ['>=', ['to-number', slider.value], ['to-number', ['get', 'year']]];
let filterOrder = ['in', ['get', 'order'], ['literal', orders]];

function updateYear() {
    updateLabel(cbOther[3].checked);
    updateBorder(cbOther[4].checked);
    filterYear = ['>=', ['to-number', slider.value], ['to-number', ['get', 'year']]];
    updateFilters();
}

function updateOrder(val, checked) {
    if (checked) {
        if (!orders.includes(val)) {
            orders.push(val);
        }
    } else {
        orders = orders.filter(o => o !== val);
    }
    filterOrder = ['in', ['get', 'order'], ['literal', orders]];
    updateFilters();
}

function updateLang(val, checked) {
    if (checked) {
        map.setLayoutProperty(`el-${val}`, 'visibility', 'visible');
        if (cbOther[1].checked) map.setLayoutProperty(`rl-${val}`, 'visibility', 'visible');
        if (cbOther[2].checked) {
            map.setLayoutProperty(`lil-${val}`, 'visibility', 'visible');
            map.setLayoutProperty(`dal-${val}`, 'visibility', 'visible');
            if (cbOther[0].checked) map.setLayoutProperty(`rl-${val}`, 'visibility', 'visible');
        }
    } else {
        map.setLayoutProperty(`el-${val}`, 'visibility', 'none');
        map.setLayoutProperty(`rl-${val}`, 'visibility', 'none');
        map.setLayoutProperty(`lil-${val}`, 'visibility', 'none');
        map.setLayoutProperty(`dal-${val}`, 'visibility', 'none');
        map.setLayoutProperty(`dol-${val}`, 'visibility', 'none');
    }
    displayMultIcon();
}

function updateFilters() {
    for (let i = 0; i < entryLayers.length; i++) {
        map.setFilter(entryLayers[i].id, ['all', filterYear, filterOrder]);
        map.setFilter(radiusLayers[i].id, ['all', filterYear, filterOrder]);
        map.setFilter(lineLayers[i].id, ['all', filterYear, filterOrder]);
        map.setFilter(dashLayers[i].id, ['all', filterYear, filterOrder]);
        map.setFilter(dotLayers[i].id, ['all', filterYear, filterOrder]);
    }
    displayMultIcon();
}

function displayMultIcon() {
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

    const multSources = { type: 'FeatureCollection', features: [] };
    multEntries.forEach((multArray) => {
        let cm = [];
        for (let i = 0; i < multArray.length; i++) {
            if (features[multArray[i]].properties.year <= slider.value && orders.includes(features[multArray[i]].properties.order) && cbLang[returnPrefix(features[multArray[i]].properties.pid)].checked) {
                cm.push(multArray[i]);
            }
        }
        if (cm.length > 1) {
            multSources.features.push({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: features[multArray[0]].geometry.coordinates }
            });
            for (let i = 1; i < cm.length; i++) {
                map.setFeatureState({ source: entryLayers[returnPrefix(features[cm[i]].properties.pid)].source, id: cm[i] }, { mult: true });
                invMult.push(cm[i]);
            }
        }
    });
    map.getSource(multLayer.source).setData(multSources);
}

function updateLib(checked) {
    if (checked) {
        map.setLayoutProperty(libLayer.id, 'visibility', 'visible');
        if (cbOther[2].checked) {
            for (let i = 0; i < dotLayers.length; i++) {
                if (cbLang[i].checked) map.setLayoutProperty(dotLayers[i].id, 'visibility', 'visible');
            }
        }
    } else {
        map.setLayoutProperty(libLayer.id, 'visibility', 'none');
        dotLayers.forEach((l) => { map.setLayoutProperty(l.id, 'visibility', 'none') });
    }
}

function updateRadius(checked) {
    if (checked) {
        for (let i = 0; i < radiusLayers.length; i++) {
            if (cbLang[i].checked) {
                map.setLayoutProperty(radiusLayers[i].id, 'visibility', 'visible');
            }
        }
    } else {
        radiusLayers.forEach((l) => { map.setLayoutProperty(l.id, 'visibility', 'none') });
    }
}

function updateLine(checked) {
    if (checked) {
        for (let i = 0; i < lineLayers.length; i++) {
            if (cbLang[i].checked) {
                map.setLayoutProperty(lineLayers[i].id, 'visibility', 'visible');
                map.setLayoutProperty(dashLayers[i].id, 'visibility', 'visible');
                if (cbOther[0].checked) map.setLayoutProperty(dotLayers[i].id, 'visibility', 'visible');
            }
        }
    } else {
        for (let i = 0; i < lineLayers.length; i++) {
            map.setLayoutProperty(lineLayers[i].id, 'visibility', 'none');
            map.setLayoutProperty(dashLayers[i].id, 'visibility', 'none');
            map.setLayoutProperty(dotLayers[i].id, 'visibility', 'none');
        }
    }
}

function updateLabel(checked) {
    currentLabels.forEach((l) => { map.setLayoutProperty(l, 'visibility', 'none') });
    if (slider.value === slider.max) {
        currentLabels = slLayers.concat(olLayers);
    } else {
        histMaps.forEach((year) => {
            if (year < slider.value) {
                currentLabels = ['world-' + year + '-labels'].concat(olLayers);
            } else {
                return;
            }
        });
    }
    if (checked) {
        currentLabels.forEach((l) => { map.setLayoutProperty(l, 'visibility', 'visible') });
    }
}

function updateBorder(checked) {
    currentBorders.forEach((l) => { map.setLayoutProperty(l, 'visibility', 'none') });
    if (slider.value === slider.max) {
        currentBorders = borderLayers;
    } else {
        histMaps.forEach((year) => {
            if (year < slider.value) {
                currentBorders = ['world-' + year + '-lines'];
            } else {
                return;
            }
        });
    }
    if (checked) {
        currentBorders.forEach((l) => { map.setLayoutProperty(l, 'visibility', 'visible') });
    }
}

function updateInf(checked) {
    if (checked) {
        infLayers.forEach((l) => { map.setLayoutProperty(l, 'visibility', 'visible') });
    } else {
        infLayers.forEach((l) => { map.setLayoutProperty(l, 'visibility', 'none') });
    }
}

function toggleSearch() {
    fieldsets.forEach((f) => { f.style.display = 'none' });
    const gd = document.querySelector('.mapboxgl-ctrl-geocoder');
    gd.style.display === 'none' ? gd.style.display = 'block' : gd.style.display = 'none';
}

function toggleFieldset(s) {
    document.querySelector('.mapboxgl-ctrl-geocoder').style.display = 'none';
    const fs = document.getElementById(s);
    const fd = fs.style.display;
    fieldsets.forEach((f) => { f.style.display = 'none' });
    if (fd !== 'flex') fs.style.display = 'flex';
}

// SET POSITION AND TEXT FOR SLIDER OUTPUT, UPDATE YEAR
function setSliderValue() {
    const sliderValue = document.getElementById('slider-value');
    // set position
    const val = ((slider.value - slider.min) / slider.step) * (slider.offsetWidth / ((slider.max - slider.min) / slider.step));
    sliderValue.style.left = `${val}px`;
    // set text
    slider.value === slider.max ? sliderValue.innerHTML = 'Heute' : sliderValue.innerHTML = slider.value;
    // update icons after setting the year
    updateYear();
}

// prevent fieldsets from closing when clicking on a checkbox
function stopFieldsetPropagation() {
    fieldsets.forEach((f) => {
        // stop propagation for each fieldset
        f.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}

stopFieldsetPropagation();

document.getElementById('taskbar').addEventListener('mousedown', () => {
    resetEntryHover();
    resetLibHover();
});