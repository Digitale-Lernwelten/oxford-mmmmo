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

const iconSources = [iconSourcesOD, iconSourcesMD, iconSourcesND, iconSourcesLT, iconSourcesFR];
const circleSources = [circleSourcesOD, circleSourcesMD, circleSourcesND, circleSourcesLT, circleSourcesFR];
const lineSources = [lineSourcesOD, lineSourcesMD, lineSourcesND, lineSourcesLT, lineSourcesFR];
const dashSources = [dashSourcesOD, dashSourcesMD, dashSourcesND, dashSourcesLT, dashSourcesFR];

const moveSources = [];
const copySources = [];

const sheets = [
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=0&single=true&output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=1628743925&single=true&output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=1534789364&single=true&output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=2043396227&single=true&output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=1032692029&single=true&output=csv'
];

const lineTemplate = {
    'type': 'Feature',
    'properties': {
        'id': '',
        'year': '',
        'order': '',
        'moved': ''
    },
    'geometry': {
        'type': 'LineString',
        'coordinates': [
            [0, 0],
            [0, 0]
        ]
    }
}

Papa.parsePromise = function (file) {
    return new Promise(function (complete, error) {
        Papa.parse(file, { download: true, complete, error });
    });
};

function ImportData() {
    console.log('start data import');
    let papaPromises = [];
    for (let i = 0; i < iconSources.length; i++) {
        papaPromises.push(Papa.parsePromise(sheets[i]));
    }

    Promise.all(papaPromises).then(results => {
        for (let i = 0; i < iconSources.length; i++) {
            for (let j = 1; j < results[i].data.length; j++) {
                iconSources[i].features.push({
                    'type': 'Feature',
                    'properties': {
                        'id': results[i].data[j][0],
                        'name': results[i].data[j][1],
                        'year': parseInt(results[i].data[j][2]),
                        'order': results[i].data[j][3],
                        'archive': results[i].data[j][4],
                        'category': results[i].data[j][5],
                        'description': results[i].data[j][6],
                    },
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [
                            parseFloat(results[i].data[j][12]),
                            parseFloat(results[i].data[j][13])
                        ]
                    }
                });

                if (results[i].data[j][8] != '') {
                    moveSources.push([results[i].data[j][0], parseFloat(results[i].data[j][12]), parseFloat(results[i].data[j][13])]);
                }

                if (results[i].data[j][10] != '') {
                    copySources.push([results[i].data[j][0], parseFloat(results[i].data[j][12]), parseFloat(results[i].data[j][13])]);
                }

                if (results[i].data[j][11] > 0) {
                    let points = DrawCircle(results[i].data[j][11], results[i].data[j][12], results[i].data[j][13]);
                    circleSources[i].features.push({
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
                    });
                }

                if (results[i].data[j][7] != '') {
                    lineSources[i].features.push({
                        'type': 'Feature',
                        'properties': {
                            'id': results[i].data[j][0],
                            'year': parseInt(results[i].data[j][2]),
                            'order': results[i].data[j][3],
                            'moved': results[i].data[j][7]
                        },
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': [
                                [],
                                [parseFloat(results[i].data[j][12]),
                                parseFloat(results[i].data[j][13])]
                            ]
                        }
                    })
                }

                if (results[i].data[j][9] != '') {
                    dashSources[i].features.push({
                        'type': 'Feature',
                        'properties': {
                            'id': results[i].data[j][0],
                            'year': parseInt(results[i].data[j][2]),
                            'order': results[i].data[j][3],
                            'origin': results[i].data[j][9],
                        },
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': [
                                [],
                                [parseFloat(results[i].data[j][12]),
                                parseFloat(results[i].data[j][13])]
                            ]
                        }
                    })
                }
            }
        }
        console.log('line sources: ', lineSources);
        console.log('dash sources: ', dashSources);
        console.log('move sources: ', moveSources);
        console.log('copy sources: ', copySources);

        for (let i = 0; i < lineSources.length; i++) {
            for (let j = 0; j < lineSources[i].features.length; j++) {
                for (let k = 0; k < moveSources.length; k++) {
                    if (lineSources[i].features[j].properties.moved === moveSources[k][0]) {
                        lineSources[i].features[j].geometry.coordinates[0] = [moveSources[k][1], moveSources[k][2]];
                        break;
                    }
                }
            }
        }

        for (let i = 0; i < dashSources.length; i++) {
            for (let j = 0; j < dashSources[i].features.length; j++) {
                for (let k = 0; k < copySources.length; k++) {
                    if (dashSources[i].features[j].properties.origin === copySources[k][0]) {
                        dashSources[i].features[j].geometry.coordinates[0] = [copySources[k][1], copySources[k][2]];
                        console.log('found origin: ', dashSources[i].features[j].properties.origin, copySources[k][0]);
                        break;
                    }
                }
            }
        }
        console.log('data imported');
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