let iconSourcesOD = { 'type': 'FeatureCollection', 'features': [] };
let iconSourcesMD = { 'type': 'FeatureCollection', 'features': [] };
let iconSourcesND = { 'type': 'FeatureCollection', 'features': [] };
let iconSourcesLT = { 'type': 'FeatureCollection', 'features': [] };
let iconSourcesFR = { 'type': 'FeatureCollection', 'features': [] };

let circleSourcesOD = { 'type': 'FeatureCollection', 'features': [] };
let circleSourcesMD = { 'type': 'FeatureCollection', 'features': [] };
let circleSourcesND = { 'type': 'FeatureCollection', 'features': [] };
let circleSourcesLT = { 'type': 'FeatureCollection', 'features': [] };
let circleSourcesFR = { 'type': 'FeatureCollection', 'features': [] };

let lineSourcesOD = { 'type': 'FeatureCollection', 'features': [] };
let lineSourcesMD = { 'type': 'FeatureCollection', 'features': [] };
let lineSourcesND = { 'type': 'FeatureCollection', 'features': [] };
let lineSourcesLT = { 'type': 'FeatureCollection', 'features': [] };
let lineSourcesFR = { 'type': 'FeatureCollection', 'features': [] };

let dashSourcesOD = { 'type': 'FeatureCollection', 'features': [] };
let dashSourcesMD = { 'type': 'FeatureCollection', 'features': [] };
let dashSourcesND = { 'type': 'FeatureCollection', 'features': [] };
let dashSourcesLT = { 'type': 'FeatureCollection', 'features': [] };
let dashSourcesFR = { 'type': 'FeatureCollection', 'features': [] };

let archiveLineSourcesOD = { 'type': 'FeatureCollection', 'features': [] };
let archiveLineSourcesMD = { 'type': 'FeatureCollection', 'features': [] };
let archiveLineSourcesND = { 'type': 'FeatureCollection', 'features': [] };
let archiveLineSourcesLT = { 'type': 'FeatureCollection', 'features': [] };
let archiveLineSourcesFR = { 'type': 'FeatureCollection', 'features': [] };

let archiveIconSources = { 'type': 'FeatureCollection', 'features': [] };
let archiveIndices = {};

const iconSources = [iconSourcesOD, iconSourcesMD, iconSourcesND, iconSourcesLT, iconSourcesFR];
const circleSources = [circleSourcesOD, circleSourcesMD, circleSourcesND, circleSourcesLT, circleSourcesFR];
const lineSources = [lineSourcesOD, lineSourcesMD, lineSourcesND, lineSourcesLT, lineSourcesFR];
const dashSources = [dashSourcesOD, dashSourcesMD, dashSourcesND, dashSourcesLT, dashSourcesFR];
const archiveLineSources = [archiveLineSourcesOD, archiveLineSourcesMD, archiveLineSourcesND, archiveLineSourcesLT, archiveLineSourcesFR]

// Variables to display entries in the sidebar
const tableOD = document.getElementById('table-od');
const tableMD = document.getElementById('table-md');
const tableND = document.getElementById('table-nd');
const tableLT = document.getElementById('table-lt');
const tableFR = document.getElementById('table-fr');
const tables = [tableOD, tableMD, tableND, tableLT, tableFR];

const entryGroups = [];

const archives = {}

const iconCoordinates = [];
const iconDoubleCoordinates = [];
const multipleIconSources = { 'type': 'FeatureCollection', 'features': [] };

// URLs to google sheets for each language: 0 = OD, 1 = MD, 2 = ND, 3 = LT, 4 = FR
const sheets = [
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=0&single=true&output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=1628743925&single=true&output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=1534789364&single=true&output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=2043396227&single=true&output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=1032692029&single=true&output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=1000674006&single=true&output=csv'
];

const hTable = new Array(6899);

function createHash(s) {
    let n = 0, m = 0, mult = 2;
    let firstChar = s.charAt(0);
    let secondChar = s.charAt(1);
    if (s.match(/^\d/)) {
        return 6000 + parseInt(s.split('*')[0]);
    }
    switch (firstChar) {
        case 'i':
            mult = 3;
            break;
        case 'c':
            n = 1500;
            break;
        case 'l':
            n = 2500;
            break;
        case 'd':
            n = 3500;
            break;
        case 'a':
            n = 4500;
            mult = 3;
            break;
        default:
            console.log('unexpected string, creating hash failed for', s);
            return null;
    }
    switch (secondChar) {
        case 'o':
            break;
        case 'm':
            m = 100;
            break;
        case 'n':
            m = 200;
            break;
        case 'l':
            m = 300;
            break;
        case 'f':
            m = 400;
            break;
        default:
            console.log('unexpected string, creating hash failed for ', s);
            return null;
    }

    const idx = parseInt(s.substr(3));
    return (n + (mult * m) + idx) % hTable.length;
}

function setItem(key, value) {
    const idx = createHash(key);
    value.id = idx;
    if (hTable[idx]) {
        hTable[idx].push([key, value]);
    } else {
        hTable[idx] = [[key, value]];
    }
}

function getItem(key) {
    const idx = createHash(key);
    if (!hTable[idx]) {
        console.log('idx not found');
        return null;
    }
    return hTable[idx].find(x => x[0] === key)[1];
}

Papa.parsePromise = function (file) {
    return new Promise(function (complete, error) {
        Papa.parse(file, { download: true, complete, error });
    });
};

function importData() {
    console.log('start data import');
    let papaPromises = [];
    for (let i = 0; i < sheets.length; i++) {
        papaPromises.push(Papa.parsePromise(sheets[i]));
    }

    Promise.all(papaPromises).then(results => {

        // set data for the first 5 sheets (od, md, nd, lt, fr)
        for (let i = 0; i < iconSources.length; i++) {
            for (let j = 1; j < results[i].data.length; j++) {
                if (results[i].data[j][0] !== "" && results[i].data[j][1] !== "" && results[i].data[j][2] !== "" && results[i].data[j][3] !== "" && results[i].data[j][4] !== "" && results[i].data[j][17] !== "" && results[i].data[j][18] !== "") {
                    // set geojson from data
                    const iconSource = {
                        'type': 'Feature',
                        'properties': {
                            'id': results[i].data[j][0],
                            'name': results[i].data[j][1],
                            'year': parseInt(results[i].data[j][2]),
                            'order': results[i].data[j][3],
                            'archive': results[i].data[j][4], //!!!
                            'category': results[i].data[j][5],
                            'date': results[i].data[j][6],
                            'location': results[i].data[j][7],
                            'extract': results[i].data[j][8],
                            'description': results[i].data[j][9],
                            'hsc': results[i].data[j][10],
                            'catalog': results[i].data[j][11],
                            'digitalisat': results[i].data[j][12],
                            'references': results[i].data[j][13],
                            'moved': results[i].data[j][14],
                            'origin': results[i].data[j][15],
                            'radius': parseFloat(results[i].data[j][16]),
                            'multiple': false
                        },
                        'geometry': {
                            'type': 'Point',
                            'coordinates': [
                                parseFloat(results[i].data[j][17]),
                                parseFloat(results[i].data[j][18])
                            ]
                        },
                        'id': 0
                    };

                    if (isNaN(iconSource.properties.radius)) {
                        iconSource.properties.radius = 0;
                    }

                    iconSources[i].features.push(iconSource); // push to layer source
                    setItem('i' + iconSource.properties.id, iconSource); // push to hash table

                    // push to table
                    const newTR = document.createElement('tr');
                    newTR.setAttribute('id', iconSource.properties.id);
                    if (isNaN(iconSource.properties.id.slice(-1))) {
                        console.log('isNaN: ', iconSource.properties.id);
                        const entryGroup = iconSource.properties.id.substr(0, iconSource.properties.id.length - 1);
                        newTR.className = entryGroup + ' ';
                        if (!entryGroups.includes(entryGroup)) {
                            entryGroups.push(entryGroup);
                        }
                    }

                    const orderImg = returnOrderSVG(iconSource.properties.order);
                    console.log('order img: ', orderImg);

                    newTR.className += 'row-entry';
                    newTR.role = 'button';
                    newTR.onclick = function () { showEntryInfo(newTR.id, newTR.className); };
                    newTR.innerHTML = '<td>'/*<img src="assets/orders-svg/' + orderImg + '.svg" alt="icon '*/ + orderImg + '</td><td>' + iconSource.properties.name + '</td>';
                    tables[i].appendChild(newTR);

                    //push to archive list
                    pushToArchives(iconSource);

                    logCoordinates(iconSource);

                    // set circle if source has radius
                    if (iconSource.properties.radius > 0) {
                        // draw circular polygon from coordinates and radius
                        let points = drawCircle(iconSource.properties.radius, iconSource.geometry.coordinates[0], iconSource.geometry.coordinates[1]);

                        // set geojson from data
                        const circleSource = {
                            'type': 'Feature',
                            'properties': {
                                'id': iconSource.properties.id,
                                'year': iconSource.properties.year,
                                'order': iconSource.properties.order,
                                'radius': iconSource.properties.radius
                            },
                            'geometry': {
                                'type': 'Polygon',
                                'coordinates': points
                            },
                            'id': 0
                        };

                        circleSources[i].features.push(circleSource); // push to layer source
                        setItem('c' + circleSource.properties.id, circleSource); // push to hash table
                    }
                }
            }
        }

        // set data for the 6th sheet (archives)
        for (let i = 1; i < results[5].data.length; i++) {
            const key = results[5].data[i][0];
            const value = i.toString();
            Object.assign(archiveIndices, { [key]: value });

            // set geojson from data
            const archiveIconSource = {
                'type': 'Feature',
                'properties': {
                    'id': value + '*' + key,
                    'name': key
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [
                        parseFloat(results[5].data[i][1]),
                        parseFloat(results[5].data[i][2])
                    ]
                },
                'id': 0
            };
            archiveIconSources.features.push(archiveIconSource); // push to layer source
            setItem(archiveIconSource.properties.id, archiveIconSource); // push to hash table
        }

        // set lines and dashes
        for (let i = 0; i < iconSources.length; i++) {
            for (let j = 0; j < iconSources[i].features.length; j++) {
                // set move lines
                if (iconSources[i].features[j].properties.moved !== '') {
                    const originSource = getItem('i' + iconSources[i].features[j].properties.moved);
                    originSource.properties.target = iconSources[i].features[j].properties.id;

                    const lineSource = {
                        'type': 'Feature',
                        'properties': {
                            'id': iconSources[i].features[j].properties.id,
                            'year': iconSources[i].features[j].properties.year,
                            'order': iconSources[i].features[j].properties.order
                        },
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': [
                                [originSource.geometry.coordinates[0], originSource.geometry.coordinates[1]],
                                [iconSources[i].features[j].geometry.coordinates[0], iconSources[i].features[j].geometry.coordinates[1]]
                            ]
                        },
                        'id': 0
                    };
                    lineSources[i].features.push(lineSource);
                    setItem('l' + lineSource.properties.id, lineSource);
                }
                // set origin dashes
                if (iconSources[i].features[j].properties.origin !== '') {
                    const originSource = getItem('i' + iconSources[i].features[j].properties.origin);
                    if (originSource.properties.copies) {
                        originSource.properties.copies += ',' + iconSources[i].features[j].properties.id;
                    } else {
                        originSource.properties.copies = iconSources[i].features[j].properties.id;
                    }

                    const dashSource = {
                        'type': 'Feature',
                        'properties': {
                            'id': iconSources[i].features[j].properties.id,
                            'year': iconSources[i].features[j].properties.year,
                            'order': iconSources[i].features[j].properties.order
                        },
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': [
                                [originSource.geometry.coordinates[0], originSource.geometry.coordinates[1]],
                                [iconSources[i].features[j].geometry.coordinates[0], iconSources[i].features[j].geometry.coordinates[1]]
                            ]
                        },
                        'id': 0
                    };
                    dashSources[i].features.push(dashSource);
                    setItem('d' + dashSource.properties.id, dashSource);
                }
                // set archive lines
                if (iconSources[i].features[j].properties.archive != '') {
                    const key = iconSources[i].features[j].properties.archive;
                    const value = archiveIndices[key];
                    const targetSource = getItem(value + '*' + key);
                    const archiveLineSource = {
                        'type': 'Feature',
                        'properties': {
                            'id': iconSources[i].features[j].properties.id,
                            'order': iconSources[i].features[j].properties.order
                        },
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': [
                                [iconSources[i].features[j].geometry.coordinates[0], iconSources[i].features[j].geometry.coordinates[1]],
                                [targetSource.geometry.coordinates[0], targetSource.geometry.coordinates[1]]
                            ]
                        },
                        id: 0
                    };
                    archiveLineSources[i].features.push(archiveLineSource);
                    setItem('a' + archiveLineSource.properties.id, archiveLineSource);
                }
            }
        }

        console.log('data imported', hTable);
        addMapInfo();
    });
}

function pushToArchives(iso) {
    if (archives.hasOwnProperty(iso.properties.archive)) {
        for (let i = 0; i < archives[iso.properties.archive].length; i++) {
            if (iso.properties.id.slice(-1) === archives[iso.properties.archive][i].slice(-1)) {
                archives[iso.properties.archive][i] = iso.properties.id;
                return;
            }
        }
        archives[iso.properties.archive].push(iso.properties.id);
    } else {
        archives[iso.properties.archive] = [iso.properties.id];
    }
}

function logCoordinates(iso) {
    for (let i = 0; i < iconCoordinates.length; i++) {
        if (iso.geometry.coordinates[0] === iconCoordinates[i].long) {
            // coordinates already exist. now check if it is already registered in doubleCoordinates:
            for (let j = 0; j < iconDoubleCoordinates.length; j++) {
                for (let k = 0; k < iconDoubleCoordinates[j].length; k++) {
                    if (iconDoubleCoordinates[j][k] === iconCoordinates[i].id) {
                        // already registered. only push new:
                        iconDoubleCoordinates[j].push(iso.properties.id);
                        return;
                    }
                }
            }
            // not registered in doubleCoordinates yet. Push both:
            if (iso.geometry.coordinates[1] === iconCoordinates[i].lat) {
                iconDoubleCoordinates.push([iso.properties.id, iconCoordinates[i].id]);
                return;
            }
        }
    }
    // push to coordinates to determine sources at the same location
    iconCoordinates.push({
        'id': iso.properties.id,
        'long': iso.geometry.coordinates[0],
        'lat': iso.geometry.coordinates[1]
    });
}

function returnIcon(img) {
    let imgID
    switch (img) {
        case 'Augustiner':
            imgID = 'aug';
            break;
        case 'Benediktiner':
            imgID = 'ben';
            break;
        case 'Dominikaner':
            imgID = 'dom';
            break;
        case 'Franziskaner':
            imgID = 'fra';
            break;
        case 'Kartäuser':
            imgID = 'kar';
            break;
        case 'Klarissen':
            imgID = 'kla';
            break;
        case 'Kreuzherren':
            imgID = 'krz';
            break;
        case 'Zisterzienser':
            imgID = 'zis';
            break;
        case 'Sonstiges':
            imgID = 'son';
            break;
        case 'Unbekannt':
            imgID = 'unb';
            break;
        default:
            imgID = 'unb';
            break;
    }
    return imgID;
}

function drawCircle(radius, long, lat) {
    radius = parseFloat(radius);
    long = parseFloat(long);
    lat = parseFloat(lat);
    let coords = [];
    for (let i = 0; i < 32; i++) {
        let theta = (i / 32) * (2 * Math.PI);
        let x = (radius / (111.320 * Math.cos(lat * Math.PI / 180))) * Math.cos(theta);
        let y = (radius / 110.574) * Math.sin(theta);
        let setX = Number(Math.round((long + x) + 'e' + 4) + 'e-' + 4);
        let setY = Number(Math.round((lat + y) + 'e' + 4) + 'e-' + 4);
        coords.push([setX, setY]);
    }
    coords.push(coords[0]);
    let polygon = [coords];
    return polygon;
}

function returnOrderSVG(i) {
    let osvg;
    switch (i) {
        case 'Augustiner':
            osvg = '<svg width="100%" height="100%" viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><g transform="matrix(2,0,0,2,0,0)"><path d="M15.96,32C9.079,31.978 3.5,26.385 3.5,19.5L3.5,2.5C3.5,1.337 2.736,0.736 2,0L30,0C29.291,0.709 28.5,1.182 28.5,2.515L28.5,19.5C28.5,26.399 22.899,32 16,32L15.96,32ZM4.133,1L27.829,1C27.625,1.406 27.5,1.889 27.5,2.515L27.5,19.5C27.5,25.847 22.347,31 16,31C9.653,31 4.5,25.847 4.5,19.5L4.5,2.5C4.5,1.912 4.36,1.428 4.133,1ZM14.106,10.17L12,6.959L15,7.959L16,3.959L17,7.877L20,6.959L17.894,10.17C18.758,9.855 19.765,9.926 20.565,10.383L23.071,7.877L24.132,8.938L21.62,11.45C21.859,11.884 22,12.414 22,13.041C22,16.226 18.945,17.878 17.137,20.041L23.5,20.041L23.5,26.041L8.5,26.041L8.5,20.041L14.958,20.041C13.194,17.857 10,16.236 10,13.041C10,12.414 10.141,11.884 10.38,11.45L7.868,8.938L8.929,7.877L11.435,10.383C12.235,9.926 13.242,9.855 14.106,10.17Z"/></g></svg>';
            break;
        /*case 'Benediktiner':
            orderImg = 'ben';
            break;
        case 'Dominikaner':
            orderImg = 'dom';
            break;
        case 'Franziskaner':
            orderImg = 'fra';
            break;
        case 'Kartäuser':
            orderImg = 'kar';
            break;
        case 'Klarissen':
            orderImg = 'kla';
            break;
        case 'Kreuzherren':
            orderImg = 'krz';
            break;
        case 'Zisterzienser':
            orderImg = 'zis';
            break;
        case 'Sonstiges':
            orderImg = 'son';
            break;
        case 'Unbekannt':
            orderImg = 'unb';
            break;*/
        default:
            osvg = '<svg width="100%" height="100%" viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"><g transform="matrix(2,0,0,2,0,0)"><path d="M30.5,0L1.5,0L1.5,17.5C1.5,25.503 7.997,32 16,32L16.094,32C24.053,31.949 30.5,25.472 30.5,17.5L30.5,0ZM15.741,22.431C15.062,22.437 14.504,22.649 14.066,23.066C13.622,23.489 13.4,24.027 13.4,24.679C13.4,25.322 13.617,25.852 14.052,26.271C14.486,26.689 15.06,26.898 15.773,26.898C16.486,26.898 17.06,26.689 17.494,26.271C17.929,25.852 18.146,25.322 18.146,24.679C18.146,24.027 17.924,23.489 17.479,23.066C17.035,22.642 16.466,22.431 15.773,22.431L15.741,22.431ZM17.575,20.189L17.633,19.295C17.741,18.337 18.166,17.501 18.908,16.788L20.094,15.659C21.022,14.759 21.671,13.941 22.042,13.203C22.414,12.465 22.599,11.68 22.599,10.849C22.599,9.021 22.028,7.606 20.885,6.605C19.761,5.618 18.186,5.117 16.163,5.102L16.066,5.102C14.015,5.102 12.396,5.629 11.21,6.685C10.023,7.741 9.42,9.202 9.401,11.069L13.649,11.069C13.668,10.286 13.896,9.672 14.33,9.227C14.765,8.781 15.343,8.559 16.066,8.559C17.589,8.559 18.351,9.385 18.351,11.038C18.351,11.586 18.205,12.107 17.912,12.601C17.619,13.095 17.03,13.735 16.146,14.522C15.263,15.309 14.655,16.108 14.323,16.92C13.991,17.731 13.825,18.821 13.825,20.189L17.575,20.189Z"/></g></svg>';
            break;
    }
    return osvg;
}