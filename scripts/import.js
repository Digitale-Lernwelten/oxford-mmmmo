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
            console.log('unexpected string, creating hash failed');
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
            console.log('unexpected string, creating hash failed');
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
                if (results[i].data[j][0] !== "" && results[i].data[j][1] !== "") {
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

                    const orderImg = returnIcon(iconSource.properties.order);

                    newTR.className += 'row-entry';
                    newTR.role = 'button';
                    newTR.onclick = function () { showEntryInfo(newTR.id, newTR.className); };
                    newTR.innerHTML = '<td><img src="assets/side/' + orderImg + '.png" alt="icon ' + iconSource.properties.order + '"></td><td>' + iconSource.properties.name + '</td>';
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

function pushToArchives (iso) {
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
            imgID = 'icon-aug';
            break;
        case 'Benediktiner':
            imgID = 'icon-ben';
            break;
        case 'Dominikaner':
            imgID = 'icon-dom';
            break;
        case 'Franziskaner':
            imgID = 'icon-fran';
            break;
        case 'Kartäuser':
            imgID = 'icon-kart';
            break;
        case 'Kreuzherren':
            imgID = 'icon-kreu';
            break;
        case 'Zisterzienser':
            imgID = 'icon-zist';
            break;
        case 'Sonstiges':
            imgID = 'icon-sonst';
            break;
        case 'Unbekannt':
            imgID = 'icon-unb';
            break;
        default:
            imgID = 'icon-unb';
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