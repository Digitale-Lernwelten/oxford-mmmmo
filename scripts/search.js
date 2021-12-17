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
    render: renderGeocoderItems,
    keepOpen: true,
    enableEventLogging: false
});

geocoder.on('results', () => {
    setTimeout(function () {
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

function forwardGeocoder(query) {
    const matchingFeatures = [];
    libSources.features.forEach((feature) => {
        if (feature.properties.name.toLowerCase().includes(query.toLowerCase())) {
            feature['place_name'] = feature.properties.name;
            feature['center'] = feature.geometry.coordinates;
            feature['place-type'] = ['poi'];
            matchingFeatures.push(feature);
        }
    });
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

function renderGeocoderItems(e) {
    let content;
    const newDiv = document.createElement('div');
    newDiv.className = 'geocoder-dropdown-item';
    if (e.properties.order) {
        let entries = (isNaN(e.properties.pid.slice(-1)) && e.properties.pid.substring(0, e.properties.pid.length - 1) in movedEntries) ? movedEntries[e.properties.pid.substring(0, e.properties.pid.length - 1)] : [e.id];
        newDiv.innerHTML = `<p>${e.properties.sig}</p>`;
        entries.forEach((entry) => {
            newDiv.appendChild(setListEntry(features[entry], '-geo'));
            /*content += '<div class="list-entry-profile entry-' + features[entry].properties.pid.substring(0, 2) + '">' + returnOrderSVG(features[entry].properties.order) + '<div><div><svg viewBox="0 0 32 32"><g transform="matrix(1.6,0,0,1.6,-3.2,-3.2)"><path d="M11.99,2C6.47,2 2,6.48 2,12C2,17.52 6.47,22 11.99,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 11.99,2ZM12,20C7.58,20 4,16.42 4,12C4,7.58 7.58,4 12,4C16.42,4 20,7.58 20,12C20,16.42 16.42,20 12,20ZM12.5,7L11,7L11,13L16.25,16.15L17,14.92L12.5,12.25L12.5,7Z" style="fill-rule:nonzero;"/></g></svg><p>' + features[entry].properties.date +
                '</p></div><div><svg viewBox="0 0 32 32"><path d="M16,-0C9.808,-0 4.8,5.008 4.8,11.2C4.8,19.6 16,32 16,32C16,32 27.2,19.6 27.2,11.2C27.2,5.008 22.192,-0 16,-0ZM8,11.2C8,6.784 11.584,3.2 16,3.2C20.416,3.2 24,6.784 24,11.2C24,15.808 19.392,22.704 16,27.008C12.672,22.736 8,15.76 8,11.2ZM16,7.2C18.208,7.2 20,8.992 20,11.2C20,13.408 18.208,15.2 16,15.2C13.792,15.2 12,13.408 12,11.2C12,8.992 13.792,7.2 16,7.2Z" style="fill-rule:nonzero;"/></svg><p>' + features[entry].properties.loc + '</p></div></div></div>';*/
        });
    }
    else {
        /*content = '<div class="geocoder-entry-lib"><svg viewBox="0 0 64 64"><g transform="matrix(2,0,0,2,0,0)"><path d="M32,27L0,27L0,30L32,30L32,27ZM6,12.99L2,12.99L2,24.99L6,24.99L6,12.99ZM30,12.99L26,12.99L26,24.99L30,24.99L30,12.99ZM22,12.99L18,12.99L18,24.99L22,24.99L22,12.99ZM14,12.99L10,12.99L10,24.99L14,24.99L14,12.99ZM16,1L32,9L32,10.99L0,10.952L0,8.962L16,1ZM15.5,4.628C14.798,4.237 13.761,3.99 13,3.99L13,8.99C13.761,8.99 14.798,9.237 15.5,9.628L15.5,4.628ZM16.5,9.628C17.202,9.237 18.239,8.99 19,8.99L19,3.99C18.239,3.99 17.202,4.237 16.5,4.628L16.5,9.628Z"/></g></svg><p>' +
        e.properties.name + '</p></div>';*/
        newDiv.innerHTML = `<div id="${ e.id }-geo" class="geocoder-entry-lib"><svg viewBox="0 0 64 64"><g transform="matrix(2,0,0,2,0,0)"><path d="M32,27L0,27L0,30L32,30L32,27ZM6,12.99L2,12.99L2,24.99L6,24.99L6,12.99ZM30,12.99L26,12.99L26,24.99L30,24.99L30,12.99ZM22,12.99L18,12.99L18,24.99L22,24.99L22,12.99ZM14,12.99L10,12.99L10,24.99L14,24.99L14,12.99ZM16,1L32,9L32,10.99L0,10.952L0,8.962L16,1ZM15.5,4.628C14.798,4.237 13.761,3.99 13,3.99L13,8.99C13.761,8.99 14.798,9.237 15.5,9.628L15.5,4.628ZM16.5,9.628C17.202,9.237 18.239,8.99 19,8.99L19,3.99C18.239,3.99 17.202,4.237 16.5,4.628L16.5,9.628Z"/></g></svg><p>${ e.properties.name }</p></div>`
    }
    //filterGeocoderItems(e) ? isInactive = '' : isInactive = 'inactive';
    //return `<div class="geocoder-dropdown-item">${content}</div>`;
    return newDiv.outerHTML;
}

function filterGeocoderItems(e) {
    if (e.properties.name) {
        return (cbOther[0].checked);
    } else {
        return (e.properties.year <= slider.value && orders.includes(e.properties.order) && cbLang[returnPrefix(e.properties.pid.substring(0, 2))].checked);
    }
}