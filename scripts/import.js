// SOURCES FOR EACH LAYER (OD, MD, ND, LT, FR)
const entrySources = [{ type: 'FeatureCollection', features: [] }, { type: 'FeatureCollection', features: [] }, { type: 'FeatureCollection', features: [] }, { type: 'FeatureCollection', features: [] }, { type: 'FeatureCollection', features: [] }];
const radiusSources = [{ type: 'FeatureCollection', features: [] }, { type: 'FeatureCollection', features: [] }, { type: 'FeatureCollection', features: [] }, { type: 'FeatureCollection', features: [] }, { type: 'FeatureCollection', features: [] }];
const lineSources = [{ type: 'FeatureCollection', features: [] }, { type: 'FeatureCollection', features: [] }, { type: 'FeatureCollection', features: [] }, { type: 'FeatureCollection', features: [] }, { type: 'FeatureCollection', features: [] }];
const dashSources = [{ type: 'FeatureCollection', features: [] }, { type: 'FeatureCollection', features: [] }, { type: 'FeatureCollection', features: [] }, { type: 'FeatureCollection', features: [] }, { type: 'FeatureCollection', features: [] }];
const dotSources = [{ type: 'FeatureCollection', features: [] }, { type: 'FeatureCollection', features: [] }, { type: 'FeatureCollection', features: [] }, { type: 'FeatureCollection', features: [] }, { type: 'FeatureCollection', features: [] }];

const libSources = { type: 'FeatureCollection', features: [] }; // lib sources

let features; // array to store all imported features
const multEntries = []; // array to store ids with same coordinates
const movedEntries = {}; // object to store moved entries (same manuscripts with different locations) to prevent showing up multiple times in the sidebar

const lists = [document.getElementById('list-od'), document.getElementById('list-md'), document.getElementById('list-nd'), document.getElementById('list-lt'), document.getElementById('list-fr')]; // entry lists in the sidebar

// URLS TO GOOGLE SHEETS (0 = OD, 1 = MD, 2 = ND, 3 = LT, 4 = FR, 5 = LIB)
const sheets = [
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=0&single=true&output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=1628743925&single=true&output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=1534789364&single=true&output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=2043396227&single=true&output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=1032692029&single=true&output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=1000674006&single=true&output=csv'
];

// PARSE GOOGLE SHEETS AS PROMISES
Papa.parsePromise = function (file) {
    return new Promise((complete, error) => {
        Papa.parse(file, { download: true, complete, error });
    });
};

// CALLED BY MAP.JS TO START IMPORTING AND FORMATTING THE GOOGLE SHEET DATA
function importData() {
    // create array of promises
    const papaPromises = [];
    for (let i = 0; i < sheets.length; i++) {
        papaPromises.push(Papa.parsePromise(sheets[i]));
    }
    // set data after promises are fulfilled
    Promise.all(papaPromises).then(results => {
        setLibData(results[5].data); // set data for lib sources
        for (let i = 0; i < entrySources.length; i++) {
            setEntryData(i, results[i].data); // set data for entry sources
        }
        // store all imported features in one array to make them indexable
        features = libSources.features.concat(entrySources[0].features, entrySources[1].features, entrySources[2].features, entrySources[3].features, entrySources[4].features,
            radiusSources[0].features, radiusSources[1].features, radiusSources[2].features, radiusSources[3].features, radiusSources[4].features,
            lineSources[0].features, lineSources[1].features, lineSources[2].features, lineSources[3].features, lineSources[4].features,
            dashSources[0].features, dashSources[1].features, dashSources[2].features, dashSources[3].features, dashSources[4].features,
            dotSources[0].features, dotSources[1].features, dotSources[2].features, dotSources[3].features, dotSources[4].features);
        for (let i = 0; i < features.length; i++) {
            features[i].id = i; // apply index to features, so features can be found via the index
        }
        setAdditionalData(); // set additional data that depends on other features (lib entries, mult entries, coordinates for lines, dashes and dots etc.)
        addFeatures(); // add imported features to map in map.js
    }).catch(() => {
        document.getElementById('loading-screen-load').style.display = 'none';
        document.getElementById('loading-screen-failed').style.display = 'block'; // if there was an error, swap the loading message with an error message
    });
}

// SET DATA FOR LIBS
function setLibData(d) {
    for (let i = 1; i < d.length; i++) {
        // only set lib if it has a name and coordinates
        if (d[i][0] !== '' && d[i][1] !== '' && d[i][2] !== '') {
            // apply data values to lib source (geojson-format)
            const ls = {
                type: 'Feature',
                properties: { name: d[i][0], entries: [] },
                geometry: { type: 'Point', coordinates: [parseFloat(d[i][1]), parseFloat(d[i][2])] }
            };
            libSources.features.push(ls); // push to sources
        }
    }
}

// SET DATA FOR ENTRY SOURCES
function setEntryData(i, d) {
    for (let j = 1; j < d.length; j++) {
        // only set entry if it has an id signature, year, order, lib and coordinates
        if (d[j][0] !== '' && d[j][1] !== '' && d[j][2] !== '' && d[j][3] !== '' && d[j][4] !== '' && d[j][17] !== '' && d[j][18] !== '') {
            // apply data values to entry source (geojson-format)
            const es = {
                type: 'Feature',
                properties: {
                    pid: d[j][0], sig: d[j][1], year: parseInt(d[j][2]), order: d[j][3], lib: d[j][4], category: d[j][5], date: d[j][6], loc: d[j][7], extract: d[j][8], desc: d[j][9],
                    hsc: d[j][10], catalog: d[j][11], dig: d[j][12], ref: d[j][13], origin: d[j][14], radius: (isNaN(d[j][15]) || d[j][15] === '') ? 0 : parseFloat(d[j][15])
                },
                geometry: { type: 'Point', coordinates: [parseFloat(d[j][16]), parseFloat(d[j][17])] }
            };
            entrySources[i].features.push(es); // push to sources
            if (es.properties.radius > 0) setRadiusData(i, es); // if entry has a radius, set radius
            // if the last char of property id is not a number (e.g. for od4a, od4b etc.), there are multiple entries for the same manuscript, because it has moved and/or changed its owner
            if (isNaN(es.properties.pid.slice(-1)) && es.properties.pid.slice(-1) !== 'a') setLineData(i, es); // if entry has moved, set line (from previous entry source to this entry)
            if (es.properties.origin !== '') setDashData(i, es); // if entry has origin, set dashed line (from origin source to this entry)
            setDotData(i, es); // set dotted line (from this entry to lib)
        }
    }
}

// SET DATA FOR RADIUS SOURCES
function setRadiusData(i, e) {
    let points = drawRadius(e.properties.radius, e.geometry.coordinates[0], e.geometry.coordinates[1]); // draw circular polygon
    // apply data values to radius source (geojson-format)
    const rs = {
        type: 'Feature',
        properties: { pid: e.properties.pid, year: e.properties.year, order: e.properties.order, radius: e.properties.radius },
        geometry: { type: 'Polygon', coordinates: points }
    };
    radiusSources[i].features.push(rs); // push to sources
}

// HELPER FUNCTION CALLED BY setRadiusData(): DRAW CIRCULAR POLYGON BY TAKING CENTER COORDINATES AND RADIUS
function drawRadius(r, long, lat) {
    const coords = [];
    for (let i = 0; i < 32; i++) {
        let theta = (i / 32) * (2 * Math.PI);
        let x = (r / (111.320 * Math.cos(lat * Math.PI / 180))) * Math.cos(theta); // 1 long = 111.320 km
        let y = (r / 110.574) * Math.sin(theta); // 1 lat = 110.574 km
        let setX = Number(Math.round((long + x) + 'e' + 4) + 'e-' + 4); // round x
        let setY = Number(Math.round((lat + y) + 'e' + 4) + 'e-' + 4); // round y
        coords.push([setX, setY]);
    }
    coords.push(coords[0]); // push starting coords again to close the shape
    return [coords];
}

// SET DATA FOR LINE SOURCES
function setLineData(i, e) {
    // apply values to line source (geojson-format)
    // start coordinates will be set in setAdditionalData(), because the origin source could potentially not be set yet
    const ls = {
        type: 'Feature',
        properties: { pid: e.properties.pid, year: e.properties.year, order: e.properties.order },
        geometry: { type: 'LineString', coordinates: [[0, 0], e.geometry.coordinates] }
    }
    lineSources[i].features.push(ls); // push to sources
}

// SET DATA FOR DASH SOURCES
function setDashData(i, e) {
    // apply data values to dash source
    // start coordinates will be set in setAdditionalData(), because the origin source could potentially not be set yet
    const ds = {
        type: 'Feature',
        properties: { pid: e.properties.pid, year: e.properties.year, order: e.properties.order, origin: e.properties.origin },
        geometry: { type: 'LineString', coordinates: [[0, 0], e.geometry.coordinates] }
    }
    dashSources[i].features.push(ds); // push to sources
}

// SET DATA FOR DOT SOURCES
function setDotData(i, e) {
    // get lib
    let libSource = libSources.features.find(s => s.properties.name === e.properties.lib);
    // apply data values to dot source (geojson-format)
    const ds = {
        type: 'Feature',
        properties: { pid: e.properties.pid, year: e.properties.year, order: e.properties.order, lib: e.properties.lib },
        geometry: { type: 'LineString', coordinates: [e.geometry.coordinates, libSource.geometry.coordinates] }
    };
    dotSources[i].features.push(ds); // push to sources
}

// ADDITIONAL DATA THAT CAN ONLY BE SET AFTER ALL FEATURES ARE SET AND INDEXABLE
function setAdditionalData() {
    const libList = {}; // stores an array for each lib with all contained entries
    const coords = []; // stores coordinates of all entries to determine which entries have the same coordinates
    // query all entries
    for (let i = 0; i < entrySources.length; i++) {
        entrySources[i].features.forEach((es) => {
            pushToList(es, lists[i], '-tab'); // push to list in sidebar
            // if the last char of property id is not a number (e.g. for od4a, od4b etc.), there are multiple entries for the same manuscript, because it has moved and/or changed its owner
            if (isNaN(es.properties.pid.slice(-1))) {
                if (es.properties.pid.substring(0, es.properties.pid.length - 1) in movedEntries) {
                    movedEntries[es.properties.pid.substring(0, es.properties.pid.length - 1)].push(es.id); // if there is an array with this property id already, push this id to the array
                } else {
                    movedEntries[es.properties.pid.substring(0, es.properties.pid.length - 1)] = [es.id]; // else create a key for this property id and an array with this id as value
                }
            }
            // set lib entry: if an array for this lib already exists in libList: push entry id to array : else create array with this entry id for this lib in libList
            libList[es.properties.lib] ? libList[es.properties.lib].push(es.id) : libList[es.properties.lib] = [es.id];
            setMultEntries(coords, es); // set mult entries
            coords.push({ id: es.id, coordinates: es.geometry.coordinates }); // push entry coordinates to coords
        });
    }
    // apply libList arrays to the 'entries' property of the corresponding libs
    for (let i = 0; i < libSources.features.length; i++) {
        if (libSources.features[i].properties.name in libList) {
            libSources.features[i].properties.entries = libList[libSources.features[i].properties.name];
        }
    }
    // query all lines
    for (let i = 0; i < lineSources.length; i++) {
        // set start coordinates for lines
        lineSources[i].features.forEach((ls) => {
            const movedEntriesArray = movedEntries[ls.properties.pid.substring(0, ls.properties.pid.length - 1)];
            for (let j = 1; j < movedEntriesArray.length; j++) {
                if (ls.properties.pid === features[movedEntriesArray[j]].properties.pid) {
                    ls.geometry.coordinates[0] = features[movedEntriesArray[j - 1]].geometry.coordinates; // set start coordinates
                }
            }
        });
    }
    // query all dashes
    for (let i = 0; i < dashSources.length; i++) {
        // set start coordinates for dashes
        for (let j = 0; j < dashSources[i].features.length; j++) {
            // find entry with property id that matches origin id, call returnPrefix to determine which source object contains the origin source
            let originSource = entrySources[returnPrefix(dashSources[i].features[j].properties.origin)].features.find(s => s.properties.pid === dashSources[i].features[j].properties.origin);
            dashSources[i].features[j].geometry.coordinates[0] = originSource.geometry.coordinates; // set start coordinates
        }
    }
}

// DETERMINE IF ENTRIES HAVE THE SAME COORDINATES
function setMultEntries(c, e) {
    // loop through all currently stored coords
    for (let i = 0; i < c.length; i++) {
        if (e.geometry.coordinates[0] === c[i].coordinates[0] && e.geometry.coordinates[1] === c[i].coordinates[1]) {
            // if the coordinates of this entry === previously stored coordinates, check if entry id of the stored coordinates is already included in mult entries
            for (let j = 0; j < multEntries.length; j++) {
                // if an array with ids for these coordinates already exists, push id of this entry to the array (happens if at least 3 entries have the same coordinates)
                if (multEntries[j].includes(c[i].id)) {
                    multEntries[j].push(e.id);
                    return;
                }
            }
            multEntries.push([e.id, c[i].id]); // else create an array containing this entry id and the entry id for the matching coords (happens if two entries have the same coordinates)
            return;
        }
    }
}

// HELPER FUNCTION: RETURN INDEX DEPENDING ON THE PROPERTY ID (0 = OD, 1 = MD, 2 = ND, 3 = LT, 4 = FR)
function returnPrefix(s) {
    switch (s.substring(0, 2)) {
        case 'od': return 0;
        case 'md': return 1;
        case 'nd': return 2;
        case 'lt': return 3;
        case 'fr': return 4;
        default: return;
    }
}

// CREATE LIST ITEM AND PUSH IT TO LIST (ALSO CALLED FROM side.js TO CREATE LISTS FOR LIB ENTRIES AND MULT ENTRIES)
function pushToList(e, l, apx) {
    let newLi;
    if (isNaN(e.properties.pid.slice(-1)) && document.getElementById(e.properties.pid.slice(0, -1) + apx) !== null) {
        newLi = document.getElementById(e.properties.pid.slice(0, -1) + apx); // if there exists a list item for this property already (because a manuscript has moved and has multiple entries), get list item
    } else {
        // else create list item, set attributes and content
        newLi = document.createElement('li');
        isNaN(e.properties.pid.slice(-1)) ? newLi.setAttribute('id', e.properties.pid.slice(0, -1) + apx) : newLi.setAttribute('id', e.properties.pid + apx);
        newLi.className = 'list-entry';
        newLi.innerHTML = `<p>${e.properties.sig}</p>`;
        l.appendChild(newLi);
    }
    newLi.appendChild(setListEntry(e, apx)); // set entry information for this list item (can be called multiple times if multiple entries belong to the same manuscript, because it has moved)
}

// SET ENTRY IN LIST ITEM
function setListEntry(e, apx) {
    let newDiv = document.createElement('div');
    newDiv.setAttribute('id', String(e.id) + apx);
    newDiv.className = 'list-entry-profile entry-' + e.properties.pid.substring(0, 2);
    if (e.properties.year > slider.value || !orders.includes(e.properties.order) || !cbLang[returnPrefix(e.properties.pid)].checked) {
        newDiv.className += ' inactive'; // if entry is not currently displayed on the map, add css class to grey out the icon
    }
    newDiv.setAttribute('role', 'button');
    newDiv.onclick = function () { prevSide = activeSide; displayEntry(newDiv.id.substring(0, newDiv.id.length - apx.length), newDiv.className) };
    newDiv = setEntryEvents(newDiv, e); // add hover effects to div
    newDiv.innerHTML = returnOrderSVG(e.properties.order) + '<div><div><svg viewBox="0 0 32 32"><g transform="matrix(1.6,0,0,1.6,-3.2,-3.2)"><path d="M11.99,2C6.47,2 2,6.48 2,12C2,17.52 6.47,22 11.99,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 11.99,2ZM12,20C7.58,20 4,16.42 4,12C4,7.58 7.58,4 12,4C16.42,4 20,7.58 20,12C20,16.42 16.42,20 12,20ZM12.5,7L11,7L11,13L16.25,16.15L17,14.92L12.5,12.25L12.5,7Z" style="fill-rule:nonzero;"/></g></svg><p>' + e.properties.date +
        '</p></div><div><svg viewBox="0 0 32 32"><path d="M16,-0C9.808,-0 4.8,5.008 4.8,11.2C4.8,19.6 16,32 16,32C16,32 27.2,19.6 27.2,11.2C27.2,5.008 22.192,-0 16,-0ZM8,11.2C8,6.784 11.584,3.2 16,3.2C20.416,3.2 24,6.784 24,11.2C24,15.808 19.392,22.704 16,27.008C12.672,22.736 8,15.76 8,11.2ZM16,7.2C18.208,7.2 20,8.992 20,11.2C20,13.408 18.208,15.2 16,15.2C13.792,15.2 12,13.408 12,11.2C12,8.992 13.792,7.2 16,7.2Z" style="fill-rule:nonzero;"/></svg><p>' + e.properties.loc + '</p></div></div>';
    return newDiv;
}

// ADD HOVER EFFECTS TO ENTRY IN SIDEBAR (ALSO CALLED BY search.js TO SET ENTRY EVENTS FOR SEARCH SUGGESTIONS)
function setEntryEvents(d, e) {
    d.addEventListener('mouseenter', () => {
        let sl = selectedLib; // if a lib is selected, store it in temporary variable
        setEntryHover(e);
        selectedLib = sl;
    });
    d.addEventListener('mouseleave', () => {
        if (activeSide !== 'side-entry') resetEntryHover();
        if (selectedLib) setLibHover(selectedLib); // if a lib was selected, restore hovered states for this lib
    });
    return d;
}

// RETURN SVG FOR THE CORRESPONDING ORDER
function returnOrderSVG(o) {
    switch (o) {
        case 'Augustiner':
            return '<svg viewBox="0 0 64 64"><g transform="matrix(2,0,0,2,0,0)"><path d="M15.96,32C9.079,31.978 3.5,26.385 3.5,19.5L3.5,2.5C3.5,1.337 2.736,0.736 2,0L30,0C29.291,0.709 28.5,1.182 28.5,2.515L28.5,19.5C28.5,26.399 22.899,32 16,32L15.96,32ZM4.133,1L27.829,1C27.625,1.406 27.5,1.889 27.5,2.515L27.5,19.5C27.5,25.847 22.347,31 16,31C9.653,31 4.5,25.847 4.5,19.5L4.5,2.5C4.5,1.912 4.36,1.428 4.133,1ZM14.106,10.17L12,6.959L15,7.959L16,3.959L17,7.877L20,6.959L17.894,10.17C18.758,9.855 19.765,9.926 20.565,10.383L23.071,7.877L24.132,8.938L21.62,11.45C21.859,11.884 22,12.414 22,13.041C22,16.226 18.945,17.878 17.137,20.041L23.5,20.041L23.5,26.041L8.5,26.041L8.5,20.041L14.958,20.041C13.194,17.857 10,16.236 10,13.041C10,12.414 10.141,11.884 10.38,11.45L7.868,8.938L8.929,7.877L11.435,10.383C12.235,9.926 13.242,9.855 14.106,10.17Z"/></g></svg>';
        case 'Benediktiner':
            return '<svg viewBox="0 0 64 64"><g transform="matrix(2,0,0,2,0,0)"><path d="M4.5,18.75L4.499,4.75L3.5,4L2,0L30,0L28.5,4L27.5,4.75L27.513,18.75C27.513,18.75 27.524,18.754 28.5,19.5C28.5,23.323 26.78,26.748 24.072,29.042C24.77,24.719 19.5,24.797 19.5,27C19.5,24.765 17.5,24 17.5,24L17.5,20.633L21.497,20.633L22.444,19.328L23.415,20.633L25.583,20.633L23.512,18.108L25.462,15.75L23.423,15.75L22.492,16.978L21.537,15.75L19.409,15.75L21.368,18.17L19.337,20.633L17.5,16.981L17.5,13.486L22.5,13.5L22.481,10L17.5,10L17.5,7.995L21,8L21,5L17.5,5L17.5,2L14.5,2L14.5,5L10.994,5L11,7.995L14.5,7.995L14.457,10L9.5,10L9.5,13.524L14.5,13.5L14.5,16.78L12.562,20.633L14.488,20.633L14.5,20.606L14.5,24C14.5,24 12.5,24.436 12.5,27C12.5,24.425 6.726,24.908 7.928,29.042C5.22,26.748 3.5,23.323 3.5,19.5C4.485,18.769 4.5,18.75 4.5,18.75ZM12.561,17.557C12.555,17.199 12.451,16.885 12.249,16.615C12.04,16.336 11.743,16.122 11.358,15.973C10.972,15.824 10.52,15.75 10.001,15.75L7.296,15.75L7.296,20.633L9.19,20.633L9.19,19.433L10.001,19.433C10.52,19.433 10.972,19.358 11.358,19.21C11.743,19.061 12.04,18.847 12.249,18.568C12.457,18.289 12.562,17.963 12.562,17.591L12.561,17.557Z"/></g></svg>';
        case 'Dominikaner':
            return '<svg viewBox="0 0 64 64"><g transform="matrix(2,0,0,2,0,0)"><path d="M1.5,0L30.5,0C30.5,2.215 30.516,4.315 30.49,6.312C30.489,6.32 30.487,6.328 30.485,6.336C30.458,8.466 30.384,10.476 30.192,12.38C30.192,12.397 30.193,12.415 30.193,12.433C29.542,18.87 27.559,24.098 21.576,28.601C21.57,28.603 21.565,28.605 21.56,28.608C20.685,29.268 19.723,29.913 18.666,30.543L16,32C10.959,29.723 7.665,27.064 5.515,24C5.505,23.974 5.495,23.949 5.486,23.924C4.381,22.344 3.58,20.656 3,18.857C2.996,18.854 2.993,18.851 2.989,18.849C1.41,13.914 1.48,8.151 1.498,1.499L1.497,1.499L1.5,0ZM15.998,1L29.5,1C29.5,1.534 29.501,2.027 29.503,2.497L18,14.004L24,14.004L24,12.004L27.996,16L28.707,16C28.091,19.261 26.974,22.053 24.667,24.667L17.991,17.996L17.991,26.496L19.991,26.496L16,30.487L16,31L16,31C11.963,29.17 9.263,27.085 7.266,24.732L13.993,18.003L13.991,26.496L11.991,26.496L15.991,30.496L15.993,15.997L15.998,15.997L15.998,16L17.998,14L18,5.5L20,5.5L16,1.5L15.998,15.996L14,13.997L14,5.5L12,5.5C12,5.5 15.349,2.152 15.998,1.502L15.998,1ZM28,16.004L24,20.004L24,18.004L18,18.003L16,16.003L28,16.004ZM2.496,2.497L13.997,13.997L8,13.996L8,11.996L4,15.996L15.991,15.997L13.993,17.996L8,17.996L8,19.996L4.004,16L3.221,16C2.45,12.01 2.479,7.518 2.496,2.497Z"/></g></svg>';
        case 'Franziskaner':
            return '<svg viewBox="0 0 64 64"><g transform="matrix(2,0,0,2,0,0)"><path d="M16,31C23.175,31 29,24.178 29,19C29,26.175 23.175,32 16,32C8.825,32 3,26.175 3,19C3,24.133 8.825,31 16,31ZM15.955,26.495C15.28,26.43 14.573,25.26 13.508,25.489C12.127,25.787 13.657,27.364 14.51,28.01C15.298,28.607 14.114,29.318 13.508,29.018C12.81,28.673 12.893,27.68 12.005,27.506C11.22,27.352 11.166,27.687 10.502,27.506C9.25,27.164 9.554,26.253 10.502,26.498C11.967,26.876 12.616,26.062 12.005,24.481C13.236,24.626 15.338,24.481 16.013,24.481C16.017,24.487 16.021,24.494 16.025,24.5C16.721,24.503 18.787,24.642 20,24.5C19.39,26.068 20.038,26.875 21.5,26.5C22.446,26.257 22.751,27.161 21.5,27.5C20.837,27.68 20.784,27.347 20,27.5C19.114,27.673 19.197,28.657 18.5,29C17.895,29.297 16.714,28.592 17.5,28C18.352,27.359 19.878,25.795 18.5,25.5C17.407,25.266 16.692,26.5 16,26.5C15.984,26.5 15.969,26.498 15.955,26.495ZM16.011,2.968C16.004,2.989 16,3 16,3L14.5,3L14.5,6L11.5,6L11.483,9L14.5,9L14.5,19.5C13.266,18.985 10.667,16.602 9.5,15.018C9.177,12.824 7.313,11.472 7.5,10C7.56,9.532 6.57,10.255 6.5,11C5.918,11 4.523,9.269 4.006,10C2.912,11.547 5.611,15.088 7.5,16.5C8.271,17.077 10.273,20.57 11.5,22C9.92,22.141 8.774,22.449 7.989,22.5C6.805,22.577 8.482,24.515 7.296,24.615C6.22,24.705 6.897,22.851 6.219,21.947C5.596,21.115 4.327,21.148 4.5,20.5C4.802,19.373 6.196,20.957 6.5,20C6.893,18.76 5.811,18.831 5.5,18C5.187,17.163 6.347,16.383 5,16C4.338,15.812 3.865,16.515 3,16.515L3,3.5C3,2.11 2.483,0.983 1.5,0L16,0C16.004,0.005 16.008,0.011 16.011,0.016C16.015,0.011 16.019,0.005 16.023,0L30.5,0C29.519,0.983 29.002,2.11 29.002,3.5L29.002,16.515C28.139,16.515 27.667,15.812 27.005,16C25.661,16.383 26.819,17.163 26.506,18C26.196,18.831 25.115,18.76 25.508,20C25.811,20.957 27.204,19.373 27.505,20.5C27.678,21.148 26.411,21.115 25.788,21.947C25.111,22.851 25.787,24.705 24.713,24.615C23.529,24.515 25.203,22.577 24.021,22.5C23.238,22.449 22.093,22.141 20.516,22C21.741,20.57 23.739,17.077 24.509,16.5C26.395,15.088 29.09,11.547 27.998,10C27.482,9.269 26.089,11 25.508,11C25.438,10.255 24.45,9.532 24.509,10C24.697,11.472 22.835,12.824 22.513,15.018C21.348,16.602 18.753,18.985 17.52,19.5L17.52,9L20.533,9L20.516,6L17.52,6L17.52,3L16.023,3C16.023,3 16.019,2.989 16.011,2.968Z"/></g></svg>';
        case 'Kartäuser':
            return '<svg viewBox="0 0 64 64"><g transform="matrix(2,0,0,2,0,0)"><path d="M30.5,0C29.612,0.888 28.501,2.244 28.501,3.5C28.501,6.436 28.5,13.155 28.5,17.5C28.5,28.262 17.218,28.848 16.004,31.991L16,32C14.454,28.878 3.498,28.272 3.498,17.5C3.498,13.047 3.5,6.436 3.5,3.5C3.5,1.712 2.764,1.264 1.5,0L30.5,0ZM3.806,1L16,1L28.397,1C27.88,1.797 27.501,2.674 27.501,3.5C27.501,6.436 27.5,13.155 27.5,17.5C27.5,23.471 23.691,26.018 20.444,27.756C19.002,28.528 17.654,29.154 16.698,29.807C16.419,29.998 16.171,30.194 15.954,30.396C15.722,30.194 15.458,29.997 15.166,29.806C14.178,29.159 12.83,28.538 11.406,27.77C8.183,26.031 4.498,23.47 4.498,17.5C4.498,13.047 4.5,6.436 4.5,3.5C4.5,2.34 4.264,1.641 3.806,1ZM15,8.118C14.693,7.843 14.5,7.444 14.5,7C14.5,6.172 15.172,5.5 16,5.5C16.828,5.5 17.5,6.172 17.5,7C17.5,7.444 17.307,7.843 17,8.118L17,9L18.382,9C18.657,8.693 19.056,8.5 19.5,8.5C20.328,8.5 21,9.172 21,10C21,10.828 20.328,11.5 19.5,11.5C19.056,11.5 18.657,11.307 18.382,11L17,11L17,16.083C19.836,16.56 22,19.029 22,22C22,25.311 19.311,28 16,28C12.689,28 10,25.311 10,22C10,19.029 12.164,16.56 15,16.083L15,11L13.618,11C13.343,11.307 12.944,11.5 12.5,11.5C11.672,11.5 11,10.828 11,10C11,9.172 11.672,8.5 12.5,8.5C12.944,8.5 13.343,8.693 13.618,9L15,9L15,8.118ZM26.414,8.5L25,7.086L23.586,8.5L25,9.914L26.414,8.5ZM8.409,8.5L6.995,7.086L5.581,8.5L6.995,9.914L8.409,8.5ZM24.591,6L23,4.409L21.409,6L23,7.591L24.591,6ZM10.591,6L9,4.409L7.409,6L9,7.591L10.591,6ZM21.768,4.006L20,2.239L18.232,4.006L20,5.774L21.768,4.006ZM13.768,4.006L12,2.239L10.232,4.006L12,5.774L13.768,4.006ZM17.945,3.25L16,1.305L14.055,3.25L16,5.195L17.945,3.25Z"/></g></svg>';
        case 'Klarissen':
            return '<svg viewBox="0 0 64 64"><path d="M32,62C46.35,62 58,48.355 58,38C58,52.35 46.35,64 32,64C17.65,64 6,52.35 6,38C6,48.266 17.65,62 32,62ZM31.91,52.99C30.56,52.86 29.146,50.52 27.016,50.979C24.255,51.574 27.313,54.728 29.02,56.02C30.596,57.213 28.227,58.636 27.016,58.037C25.62,57.345 25.785,55.36 24.01,55.012C22.44,54.704 22.333,55.374 21.005,55.012C18.499,54.328 19.109,52.506 21.005,52.995C23.934,53.752 25.233,52.124 24.01,48.962C26.472,49.251 30.676,48.962 32.025,48.962C32.034,48.975 32.042,48.987 32.05,49C33.442,49.007 37.573,49.283 40,49C38.78,52.136 40.077,53.75 43,53C44.892,52.514 45.501,54.322 43,55C41.675,55.359 41.567,54.694 40,55C38.229,55.346 38.394,57.315 37,58C35.791,58.595 33.427,57.184 35,56C36.703,54.718 39.756,51.59 37,51C34.813,50.532 33.383,53 32,53C31.969,53 31.939,52.996 31.91,52.99ZM35.041,39C33.79,39.523 30.295,39.54 29,39C26.531,37.97 21.333,33.203 19,30.037C18.353,25.648 14.625,22.943 15,20C15.119,19.065 13.141,20.511 13,22C11.835,22 9.045,18.537 8.011,20C5.824,23.094 11.223,30.176 15,33C16.542,34.153 20.546,41.141 23,44C19.84,44.281 17.548,44.898 15.978,45C13.61,45.154 16.963,49.03 14.592,49.229C12.44,49.41 13.794,45.702 12.439,43.894C11.192,42.23 8.654,42.295 9,41C9.603,38.745 12.393,41.914 13,40C13.787,37.52 11.621,37.661 11,36C10.374,34.326 12.694,32.766 10,32C8.676,31.623 7.73,33.029 6,33.029L6,7C6,4.22 4.966,1.966 3,0L32,0C32.008,0.011 32.015,0.021 32.023,0.032C32.03,0.021 32.038,0.011 32.045,0L61,0C59.037,1.966 58.005,4.22 58.005,7L58.005,33.029C56.278,33.029 55.333,31.623 54.011,32C51.321,32.766 53.638,34.326 53.013,36C52.392,37.661 50.23,37.52 51.016,40C51.622,41.914 54.407,38.745 55.009,41C55.355,42.295 52.821,42.23 51.576,43.894C50.223,45.702 51.575,49.41 49.426,49.229C47.059,49.03 50.407,45.154 48.043,45C46.475,44.898 44.186,44.281 41.031,44C43.482,41.141 47.479,34.153 49.019,33C52.79,30.176 58.181,23.094 55.997,20C54.964,18.537 52.179,22 51.016,22C50.875,20.511 48.9,19.065 49.019,20C49.393,22.943 45.671,25.648 45.025,30.037C42.695,33.203 37.506,37.97 35.041,39ZM28.007,13.333L28.007,6L22.007,6L22.007,30L28.007,30L28.007,22.667L34.16,30L41.993,30L31.924,18L41.993,6L34.16,6L28.007,13.333Z"/></svg>';
        case 'Kreuzherren':
            return '<svg viewBox="0 0 64 64"><g transform="matrix(2,0,0,2,0,0)"><path d="M15.884,31.947L16.002,32L18.668,30.543C19.724,29.913 20.686,29.269 21.562,28.608L21.577,28.601C27.56,24.098 29.544,18.87 30.194,12.433C30.194,12.415 30.194,12.397 30.194,12.379C30.386,10.475 30.46,8.466 30.487,6.337C30.488,6.329 30.49,6.32 30.492,6.312C30.517,4.378 30.503,2.346 30.502,0.207L30.502,0L1.502,0L1.499,1.499C1.482,8.151 1.411,13.914 2.991,18.849C2.994,18.851 2.998,18.854 3.001,18.857C3.581,20.655 4.382,22.343 5.486,23.922C5.496,23.947 5.506,23.973 5.516,24C7.65,27.04 10.909,29.682 15.884,31.947ZM14.375,21.435L10.371,21L12.75,24.25L10.371,27.5L14.375,27.065L16,30.75L17.625,27.065L21.629,27.5L19.25,24.25L21.629,21L17.625,21.435L16,17.75L14.375,21.435ZM12.5,1L15,9L7,6.5L9.955,10L7,13.5L15,11L12.5,19L16,16L19.5,19L17,11L25,13.5L22,10L25,6.5L17,9L19.5,1L16,4L12.5,1Z"/></g></svg>';
        case 'Zisterzienser':
            return '<svg viewBox="0 0 64 64"><g transform="matrix(2,0,0,2,0,0)"><path d="M30.502,0.207C30.503,2.346 30.517,4.378 30.492,6.312C30.49,6.32 30.488,6.329 30.487,6.337C30.46,8.466 30.386,10.475 30.194,12.379C30.194,12.397 30.194,12.415 30.194,12.433C29.544,18.87 27.56,24.098 21.577,28.601L21.562,28.608C20.686,29.269 19.724,29.913 18.668,30.543L16.002,32C10.96,29.723 7.667,27.064 5.516,24C5.506,23.973 5.496,23.947 5.486,23.922C4.382,22.343 3.581,20.655 3.001,18.857C2.998,18.854 2.994,18.851 2.991,18.849C1.411,13.914 1.482,8.151 1.499,1.499L1.502,0L30.502,0L30.502,0.207ZM22.551,4L26.876,4C26.876,5.296 26.883,6.54 26.877,7.735L26.88,7.738L26.875,8.152L28,6.879L29.875,9L28,11.121L26.846,9.815C26.816,11.022 26.757,12.177 26.645,13.284C26.646,13.298 26.646,13.311 26.646,13.325C26.605,13.725 26.558,14.119 26.503,14.507L27.5,13.379L29.375,15.5L27.5,17.621L26.208,16.159C25.98,17.201 25.677,18.197 25.271,19.153L27.125,21.25L25.25,23.371L23.827,21.762C23.248,22.588 22.558,23.382 21.739,24.149L23.375,26L21.5,28.121L19.625,26L19.98,25.599C19.375,26.045 18.717,26.48 18.001,26.907L16.669,27.635L17.875,29L16,31.121L14.125,29L15.299,27.672C14.207,27.146 13.233,26.593 12.362,26.014L10.5,28.121L8.625,26L10.144,24.282C9.359,23.557 8.697,22.797 8.137,22C8.129,21.98 8.122,21.96 8.114,21.941C8.1,21.92 8.085,21.899 8.07,21.878L6.75,23.371L4.875,21.25L6.651,19.241C6.504,18.882 6.371,18.515 6.251,18.143C6.248,18.141 6.246,18.139 6.243,18.136C6.044,17.513 5.879,16.872 5.744,16.214L4.5,17.621L2.625,15.5L4.5,13.379L5.453,14.457C5.263,12.995 5.179,11.452 5.144,9.827L4,11.121L2.125,9L4,6.879L5.123,8.149C5.117,7.169 5.122,6.161 5.124,5.124L5.126,4L9.451,4L8.125,2.5L10,0.379L11.875,2.5L10.549,4L15.451,4L14.125,2.5L16,0.379L17.875,2.5L16.549,4L21.452,4L20.127,2.5L22.002,0.379L23.877,2.5L22.551,4ZM7.808,16.95L16.551,25.693L16.001,26C12.917,24.577 10.902,22.915 9.586,21C9.58,20.983 8.402,18.91 8.047,17.786C8.045,17.784 8.043,17.782 8.041,17.78C7.956,17.508 7.878,17.231 7.808,16.95ZM8.172,6L22.619,20.447C21.949,21.503 21.08,22.497 19.955,23.44L7.14,10.625C7.119,9.448 7.125,8.219 7.129,6.937L7.13,6L8.172,6ZM24.26,16.431L13.828,6L19.485,6L24.833,11.347C24.805,12.173 24.76,12.969 24.684,13.737C24.684,13.748 24.684,13.759 24.684,13.77C24.593,14.696 24.458,15.582 24.26,16.431ZM2.125,2.5L4,0.379L5.875,2.5L4,4.621L2.125,2.5ZM28,0.379L29.875,2.5L28,4.621L26.125,2.5L28,0.379Z"/></g></svg>';
        case 'Sonstige':
            return '<svg viewBox="0 0 64 64"><g transform="matrix(1.33327,0,0,1.33327,-3.7428,-21.3292)"><path d="M5.057,15.998L48.559,15.998L48.559,42.249C48.559,54.254 38.813,64 26.808,64C14.804,64 5.057,54.254 5.057,42.249L5.057,15.998Z"/></g></svg>';
        case 'Unbekannt':
            return '<svg viewBox="0 0 64 64"><g transform="matrix(2,0,0,2,0,0)"><path d="M30.5,0L1.5,0L1.5,17.5C1.5,25.503 7.997,32 16,32L16.094,32C24.053,31.949 30.5,25.472 30.5,17.5L30.5,0ZM15.741,22.431C15.062,22.437 14.504,22.649 14.066,23.066C13.622,23.489 13.4,24.027 13.4,24.679C13.4,25.322 13.617,25.852 14.052,26.271C14.486,26.689 15.06,26.898 15.773,26.898C16.486,26.898 17.06,26.689 17.494,26.271C17.929,25.852 18.146,25.322 18.146,24.679C18.146,24.027 17.924,23.489 17.479,23.066C17.035,22.642 16.466,22.431 15.773,22.431L15.741,22.431ZM17.575,20.189L17.633,19.295C17.741,18.337 18.166,17.501 18.908,16.788L20.094,15.659C21.022,14.759 21.671,13.941 22.042,13.203C22.414,12.465 22.599,11.68 22.599,10.849C22.599,9.021 22.028,7.606 20.885,6.605C19.761,5.618 18.186,5.117 16.163,5.102L16.066,5.102C14.015,5.102 12.396,5.629 11.21,6.685C10.023,7.741 9.42,9.202 9.401,11.069L13.649,11.069C13.668,10.286 13.896,9.672 14.33,9.227C14.765,8.781 15.343,8.559 16.066,8.559C17.589,8.559 18.351,9.385 18.351,11.038C18.351,11.586 18.205,12.107 17.912,12.601C17.619,13.095 17.03,13.735 16.146,14.522C15.263,15.309 14.655,16.108 14.323,16.92C13.991,17.731 13.825,18.821 13.825,20.189L17.575,20.189Z"/></g></svg>';
        default:
            return '<svg viewBox="0 0 64 64"><g transform="matrix(1.33327,0,0,1.33327,-3.7428,-21.3292)"><path d="M5.057,15.998L48.559,15.998L48.559,42.249C48.559,54.254 38.813,64 26.808,64C14.804,64 5.057,54.254 5.057,42.249L5.057,15.998Z"/></g></svg>';
    }
}