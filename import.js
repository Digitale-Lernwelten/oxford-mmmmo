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

const iconSources = [iconSourcesOD, iconSourcesMD, iconSourcesND, iconSourcesLT, iconSourcesFR];
const circleSources = [circleSourcesOD, circleSourcesMD, circleSourcesND, circleSourcesLT, circleSourcesFR];
const lineSources = [lineSourcesOD, lineSourcesMD, lineSourcesND, lineSourcesLT, lineSourcesFR];
const dashSources = [dashSourcesOD, dashSourcesMD, dashSourcesND, dashSourcesLT, dashSourcesFR];
const archiveLineSources = [archiveLineSourcesOD, archiveLineSourcesMD, archiveLineSourcesND, archiveLineSourcesLT, archiveLineSourcesFR]

const sheets = [
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=0&single=true&output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=1628743925&single=true&output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=1534789364&single=true&output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=2043396227&single=true&output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=1032692029&single=true&output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=1000674006&single=true&output=csv'
];

function CreateHash(s) {
    let hash = 0;
    if (s.startsWith('iod')) {
        hash = 0;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('imd')) {
        hash = 300;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('ind')) {
        hash = 6000;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('ilt')) {
        hash = 900;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('ifr')) {
        hash = 1200;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('cod')) {
        hash = 1500;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('cmd')) {
        hash = 1700;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('cnd')) {
        hash = 1900;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('clt')) {
        hash = 2100;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('cfr')) {
        hash = 2300;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('lod')) {
        hash = 2500;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('lmd')) {
        hash = 2700;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('lnd')) {
        hash = 2900;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('llt')) {
        hash = 3100;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('lfr')) {
        hash = 3300;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('dod')) {
        hash = 3500;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('dmd')) {
        hash = 3700;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('dnd')) {
        hash = 3900;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('dlt')) {
        hash = 410;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('dfr')) {
        hash = 4300;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('aod')) {
        hash = 4500;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('amd')) {
        hash = 4800;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('and')) {
        hash = 5100;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('alt')) {
        hash = 5400;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('afr')) {
        hash = 5700;
        hash += parseInt(s.substring(3));
    } else if (s.startsWith('lib')) {
        hash = 6000;
        hash = (hash + (((s.charCodeAt(3) * 3) + (s.charCodeAt(4) * 2) + (s.charCodeAt(5))))) % 7499;
    } else {
        console.log('unexpected string, creating hash failed');
        return null;
    }
    return hash;
}

class HashTable {
    table = new Array(7499);

    setItem = (key, value) => {
        const idx = CreateHash(key);
        if (this.table[idx]) {
            this.table[idx].push([key, value]);
        } else {
            this.table[idx] = [[key, value]];
        }
    }

    getItem = key => {
        const idx = CreateHash(key);

        if (!this.table[idx]) {
            console.log('idx not found');
            return null;
        }

        return this.table[idx].find(x => x[0] === key)[1];
    }
}

const hTable = new HashTable();

Papa.parsePromise = function (file) {
    return new Promise(function (complete, error) {
        Papa.parse(file, { download: true, complete, error });
    });
};

function ImportData() {
    console.log('start data import');
    let papaPromises = [];
    for (let i = 0; i < sheets.length; i++) {
        papaPromises.push(Papa.parsePromise(sheets[i]));
    }

    Promise.all(papaPromises).then(results => {

        // set data for the first 5 sheets (od, md, nd, lt, fr)
        for (let i = 0; i < iconSources.length; i++) {
            for (let j = 1; j < results[i].data.length; j++) {
                
                // set geojson from data
                const iconSource = {
                    'type': 'Feature',
                    'properties': {
                        'id': results[i].data[j][0],
                        'name': results[i].data[j][1],
                        'year': parseInt(results[i].data[j][2]),
                        'order': results[i].data[j][3],
                        'archive': results[i].data[j][4],
                        'category': results[i].data[j][5],
                        'description': results[i].data[j][6],
                        'hsc': results[i].data[j][7],
                        'catalog': results[i].data[j][8],
                        'digitalisat': results[i].data[j][9],
                        'moved': results[i].data[j][10],
                        'origin': results[i].data[j][11],
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [
                            parseFloat(results[i].data[j][13]),
                            parseFloat(results[i].data[j][14])
                        ]
                    }
                };

                iconSources[i].features.push(iconSource); // push to layer source
                hTable.setItem('i' + iconSource.properties.id, iconSource); // push to hash table

                // set circle if source has radius
                if (results[i].data[j][12] > 0) {
                    // draw circular polygon from coordinates and radius
                    let points = DrawCircle(results[i].data[j][12], results[i].data[j][13], results[i].data[j][14]);

                    // set geojson from data
                    const circleSource = {
                        'type': 'Feature',
                        'properties': {
                            'id': results[i].data[j][0],
                            'year': parseInt(results[i].data[j][2]),
                            'order': results[i].data[j][3]

                        },
                        'geometry': {
                            'type': 'Polygon',
                            'coordinates': points
                        }
                    };

                    circleSources[i].features.push(circleSource); // push to layer source
                    hTable.setItem('c' + circleSource.properties.id, circleSource); // push to hash table
                }
            }
        }

        // set data for the 6th sheet (archives)
        for (let i = 1; i < results[5].data.length; i++) {

            // set geojson from data
            const archiveIconSource = {
                'type': 'Feature',
                'properties': {
                    'id': results[5].data[i][0],
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [
                        parseFloat(results[5].data[i][1]),
                        parseFloat(results[5].data[i][2])
                    ]
                }
            };
            archiveIconSources.features.push(archiveIconSource); // push to layer source
            hTable.setItem('lib' + archiveIconSource.properties.id, archiveIconSource); // push to hash table
        }

        // set lines and dashes
        for (let i = 0; i < iconSources.length; i++) {
            for (let j = 0; j < iconSources[i].features.length; j++) {
                // set move lines
                if (iconSources[i].features[j].properties.moved != '') {
                    const originSource = hTable.getItem('i' + iconSources[i].features[j].properties.moved);
                    console.log('get item: i' + iconSources[i].features[j].properties.moved);
                    console.log('got item: ', originSource);
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
                        }
                    };
                    lineSources[i].features.push(lineSource);
                    hTable.setItem('l' + lineSource.properties.id, lineSource);
                }
                // set origin dashes
                if (iconSources[i].features[j].properties.origin != '') {
                    const originSource = hTable.getItem('i' + iconSources[i].features[j].properties.origin);
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
                        }
                    };
                    dashSources[i].features.push(dashSource);
                    hTable.setItem('d' + dashSource.properties.id, dashSource);
                }
                // set archive lines
                if (iconSources[i].features[j].properties.archive != '') {
                    const targetSource = hTable.getItem('lib' + iconSources[i].features[j].properties.archive);
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
                        }
                    };
                    archiveLineSources[i].features.push(archiveLineSource);
                    hTable.setItem('a' + archiveLineSource.properties.id, archiveLineSource);
                }
            }
        }
        
        console.log('data imported', hTable);
        AddMapInfo();
    });
}

function DrawCircle(radius, long, lat) {
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