// CREATE GEOCODER
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    flyTo: false, // fly to will be called manually depending on if the result is currently visible on the map
    placeholder: "Suchbegriff eingeben",
    bbox: [-130, 20, 45, 70], // same bounding box as the map
    localGeocoder: forwardGeocoder,
    localGeocoderOnly: true, // only search entries and libs, no other locations
    marker: false, // do not set a marker at the location
    render: renderGeocoderItems,
    enableEventLogging: false // opt out of mapbox collecting user data
});

// FIRED WHEN THE GEOCODER RETURNS A RESPONSE 
geocoder.on('results', () => {
    // wait for html elements to be created
    setTimeout(function () {
        // add events (when suggestions are clicked or hovered)
        document.querySelectorAll('.geocoder-dropdown-item > .list-entry-profile').forEach((item) => {
            item = setEntryEvents(item, features[item.id.substring(0, item.id.length - 4)]);
            item.addEventListener('mousedown', () => { displayEntry(item.id.substring(0, item.id.length - 4), item.className); revSide = 'side-home' });
        });
        document.querySelectorAll('.geocoder-dropdown-item > .geocoder-entry-lib').forEach((item) => {
            console.log('set events for: ', item);
            item.addEventListener('mouseenter', () => {
                setLibHover(features[item.id.substring(0, item.id.length - 4)]);
            });
            item.addEventListener('mouseleave', () => {
                resetLibHover();
            });
            item.addEventListener('mousedown', () => {
                displayLibEntries(item.id.substring(0, item.id.length - 4), cbOther[0].checked);
            });
        });
    }, 100);
});

// DECIDE WHICH FEATURES MATCH A SEARCH QUERY IS ENTERED
function forwardGeocoder(query) {
    const matchingFeatures = [];
    // add libs with a matching name
    libSources.features.forEach((feature) => {
        if (feature.properties.name.toLowerCase().includes(query.toLowerCase())) {
            feature['place_name'] = feature.properties.name;
            feature['center'] = feature.geometry.coordinates;
            feature['place-type'] = ['poi'];
            matchingFeatures.push(feature);
        }
    });
    // add entries with a matching signature, date or location
    // if a manuscript has moved (so it has multiple entries), only add it once
    for (let i = 0; i < entrySources.length; i++) {
        entrySources[i].features.forEach((f) => {
            if ((f.properties.sig.toLowerCase().includes(query.toLowerCase()) || f.properties.date.toLowerCase().includes(query.toLowerCase()) || f.properties.loc.toLowerCase().includes(query.toLowerCase())) && ((!isNaN(f.properties.pid.slice(-1)) || f.properties.pid.slice(-1) === 'a'))) {
                f['place_name'] = f.properties.sig;
                f['center'] = f.geometry.coordinates;
                f['place-type'] = ['poi'];
                matchingFeatures.push(f);
            }
        });
    }
    return matchingFeatures;
}

// RENDER MATCHING FEATURES IN THE SUGGESTIONS PANEL
function renderGeocoderItems(e) {
    const newDiv = document.createElement('div');
    newDiv.className = 'geocoder-dropdown-item';
    if (e.properties.order) { // feature is an entry
        // if manuscript has moved, add all corresponding entries to div, else only add this entry
        let entries = (isNaN(e.properties.pid.slice(-1)) && e.properties.pid.substring(0, e.properties.pid.length - 1) in movedEntries) ? movedEntries[e.properties.pid.substring(0, e.properties.pid.length - 1)] : [e.id];
        newDiv.innerHTML = `<p>${e.properties.sig}</p>`;
        entries.forEach((entry) => {
            newDiv.appendChild(setListEntry(features[entry], '-geo')); // create html for entry (by calling setListEntry() in import.js)
        });
    } else { // feature is a lib, add lib svg and lib name to div
        newDiv.innerHTML = `<div id="${ e.id }-geo" class="geocoder-entry-lib"><svg viewBox="0 0 64 64"><g transform="matrix(2,0,0,2,0,0)"><path d="M32,27L0,27L0,30L32,30L32,27ZM6,12.99L2,12.99L2,24.99L6,24.99L6,12.99ZM30,12.99L26,12.99L26,24.99L30,24.99L30,12.99ZM22,12.99L18,12.99L18,24.99L22,24.99L22,12.99ZM14,12.99L10,12.99L10,24.99L14,24.99L14,12.99ZM16,1L32,9L32,10.99L0,10.952L0,8.962L16,1ZM15.5,4.628C14.798,4.237 13.761,3.99 13,3.99L13,8.99C13.761,8.99 14.798,9.237 15.5,9.628L15.5,4.628ZM16.5,9.628C17.202,9.237 18.239,8.99 19,8.99L19,3.99C18.239,3.99 17.202,4.237 16.5,4.628L16.5,9.628Z"/></g></svg><p>${ e.properties.name }</p></div>`
    }
    return newDiv.outerHTML;
}