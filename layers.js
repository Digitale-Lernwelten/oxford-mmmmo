const orderIcons = ['icon-aug', 'icon-ben', 'icon-dom', 'icon-fran', 'icon-jes', 'icon-kart', 'icon-zist', 'icon-priv', 'icon-sonst', 'icon-unb'];

const iconColors = {
    od: ['#A6644A', '#A66A53', '#A6705C', '#A67665', '#A67C6E', '#A68277', '#A68880', '#A68E89', '#A69492', '#A69A9B', '#A6A0A4'],
    md: ['#A64A46', '#A6534F', '#A65C58', '#A66561', '#A66E6A', '#A67773', '#A6807C', '#A68985', '#A6928E', '#A69B97', '#A6A4A0'],
    nd: ['#A4466A', '#A44F70', '#A45876', '#A4617C', '#A46A82', '#A47388', '#A47C8E', '#A48594', '#A48E9A', '#A497A0', '#A4A0A6'],
    lt: ['#466AA4', '#4F70A4', '#5876A4', '#617CA4', '#6A82A4', '#7388A4', '#7C8EA4', '#8594A4', '#8E9AA4', '#97A0A4', 'A0A6A4'],
    fr: ['#46A64A', '#4FA653', '#58A65C', '#61A665', '#6AA66E', '#73A677', '#7CA680', '#85A689', '#8EA692', '#97A69B', '#A0A6A4'],
    grey: ['#464646', '#6A6A6A', '#A6A6A6']
};

const stateNameLayers = ['country-label', 'state-label'];
const otherNameLayers = ['natural-line-label', 'natural-point-label', 'poi-label', 'settlement-major-label', 'settlement-minor-label', 'settlement-subdivision-label', 'water-point-label', 'waterway-label'];
const borderLayers = ['admin-0-boundary', 'admin-0-boundary-bg', 'admin-0-boundary-disputed', 'admin-1-boundary', 'admin-1-boundary-bg'];
const infrastructureLayers = ['aeroway-line', 'aeroway-polygon', 'bridge-major-link', 'bridge-major-link-case', 'bridge-major-link-2', 'bridge-major-link-2-case', 'bridge-motorway-trunk',
    'bridge-motorway-trunk-case', 'bridge-motorway-trunk-2', 'bridge-motorway-trunk-2-case', 'bridge-primary-secondary-tertiary', 'bridge-primary-secondary-tertiary-case', 'bridge-rail',
    'bridge-street-minor', 'bridge-street-minor-case', 'bridge-street-minor-low', 'building', 'building-outline', 'road-intersection', 'road-major-link', 'road-major-link-case', 'road-minor',
    'road-minor-case', 'road-minor-low', 'road-motorway-trunk', 'road-motorway-trunk-case', 'road-primary', 'road-primary-case', 'road-rail', 'road-secondary-tertiary', 'road-secondary-tertiary-case',
    'road-street', 'road-street-case', 'road-street-low', 'tunnel-major-link', 'tunnel-major-link-case', 'tunnel-motorway-trunk', 'tunnel-motorway-trunk-case', 'tunnel-primary-secondary-tertiary',
    'tunnel-primary-secondary-tertiary-case', 'tunnel-street-minor', 'tunnel-street-minor-case', 'tunnel-street-minor-low', 'waterway', 'waterway-shadow'];
const historicalMaps = [1279, 1492, 1530, 1650, 1715, 1783];

const iconLayers = [
    {
        id: 'layer-icons-od',
        source: 'data-icons-od',
        type: 'symbol',
        layout: {
            'icon-image': ['match', ['get', 'order'],
                'Augustiner', orderIcons[0],
                'Benediktiner', orderIcons[1],
                'Dominikaner', orderIcons[2],
                'Franziskaner', orderIcons[3],
                'Jesuiten', orderIcons[4],
                'Kartäuser', orderIcons[5],
                'Zisterzienser', orderIcons[6],
                'Privatbesitz', orderIcons[7],
                'Sonstiger Orden', orderIcons[8],
                'Unbekannter Orden', orderIcons[9],
                /*fallback*/ orderIcons[9]],
            'icon-size': 1,
            'icon-allow-overlap': true,
            'icon-size': ['interpolate', ['linear'], ['zoom'], 4, 0.2, 14, 0.8],
            'symbol-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'icon-color': iconColors.od[0],
            'icon-halo-blur': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 14, 1.6],
            'icon-halo-color': iconColors.grey[0],
            'icon-halo-width': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 14, 1.6],
            'icon-opacity': 0.8
        }
    },
    {
        id: 'layer-icons-md',
        source: 'data-icons-md',
        type: 'symbol',
        layout: {
            'icon-image': ['match', ['get', 'order'],
                'Augustiner', orderIcons[0],
                'Benediktiner', orderIcons[1],
                'Dominikaner', orderIcons[2],
                'Franziskaner', orderIcons[3],
                'Jesuiten', orderIcons[4],
                'Kartäuser', orderIcons[5],
                'Zisterzienser', orderIcons[6],
                'Privatbesitz', orderIcons[7],
                'Sonstiger Orden', orderIcons[8],
                'Unbekannter Orden', orderIcons[9],
                /*fallback*/ orderIcons[9]],
            'icon-size': 1,
            'icon-allow-overlap': true,
            'icon-size': ['interpolate', ['linear'], ['zoom'], 4, 0.2, 14, 0.8],
            'symbol-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'icon-color': iconColors.md[0],
            'icon-halo-blur': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 14, 1.6],
            'icon-halo-color': iconColors.grey[0],
            'icon-halo-width': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 14, 1.6],
            'icon-opacity': 0.8
        }
    },
    {
        id: 'layer-icons-nd',
        source: 'data-icons-nd',
        type: 'symbol',
        layout: {
            'icon-image': ['match', ['get', 'order'],
                'Augustiner', orderIcons[0],
                'Benediktiner', orderIcons[1],
                'Dominikaner', orderIcons[2],
                'Franziskaner', orderIcons[3],
                'Jesuiten', orderIcons[4],
                'Kartäuser', orderIcons[5],
                'Zisterzienser', orderIcons[6],
                'Privatbesitz', orderIcons[7],
                'Sonstiger Orden', orderIcons[8],
                'Unbekannter Orden', orderIcons[9],
                /*fallback*/ orderIcons[9]],
            'icon-size': 1,
            'icon-allow-overlap': true,
            'icon-size': ['interpolate', ['linear'], ['zoom'], 4, 0.2, 14, 0.8],
            'symbol-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'icon-color': iconColors.nd[0],
            'icon-halo-blur': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 14, 1.6],
            'icon-halo-color': iconColors.grey[0],
            'icon-halo-width': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 14, 1.6],
            'icon-opacity': 0.8
        }
    },
    {
        id: 'layer-icons-lt',
        source: 'data-icons-lt',
        type: 'symbol',
        layout: {
            'icon-image': ['match', ['get', 'order'],
                'Augustiner', orderIcons[0],
                'Benediktiner', orderIcons[1],
                'Dominikaner', orderIcons[2],
                'Franziskaner', orderIcons[3],
                'Jesuiten', orderIcons[4],
                'Kartäuser', orderIcons[5],
                'Zisterzienser', orderIcons[6],
                'Privatbesitz', orderIcons[7],
                'Sonstiger Orden', orderIcons[8],
                'Unbekannter Orden', orderIcons[9],
                /*fallback*/ orderIcons[9]],
            'icon-size': 1,
            'icon-allow-overlap': true,
            'icon-size': ['interpolate', ['linear'], ['zoom'], 4, 0.2, 14, 0.8],
            'symbol-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'icon-color': iconColors.lt[0],
            'icon-halo-blur': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 14, 1.6],
            'icon-halo-color': iconColors.grey[0],
            'icon-halo-width': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 14, 1.6],
            'icon-opacity': 0.8
        }
    },
    {
        id: 'layer-icons-fr',
        source: 'data-icons-fr',
        type: 'symbol',
        layout: {
            'icon-image': ['match', ['get', 'order'],
                'Augustiner', orderIcons[0],
                'Benediktiner', orderIcons[1],
                'Dominikaner', orderIcons[2],
                'Franziskaner', orderIcons[3],
                'Jesuiten', orderIcons[4],
                'Kartäuser', orderIcons[5],
                'Zisterzienser', orderIcons[6],
                'Privatbesitz', orderIcons[7],
                'Sonstiger Orden', orderIcons[8],
                'Unbekannter Orden', orderIcons[9],
                /*fallback*/ orderIcons[9]],
            'icon-size': 1,
            'icon-allow-overlap': true,
            'icon-size': ['interpolate', ['linear'], ['zoom'], 4, 0.2, 14, 0.8],
            'symbol-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'icon-color': iconColors.fr[0],
            'icon-halo-blur': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 14, 1.6],
            'icon-halo-color': iconColors.grey[0],
            'icon-halo-width': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 14, 1.6],
            'icon-opacity': 0.8
        }
    }
];

const circleLayers = [
    {
        id: 'layer-circles-od',
        source: 'data-circles-od',
        type: 'fill',
        layout: {
            'fill-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'fill-color': iconColors.od[0],
            'fill-opacity': 0.1
        }
    },
    {
        id: 'layer-circles-md',
        source: 'data-circles-md',
        type: 'fill',
        layout: {
            'fill-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'fill-color': iconColors.md[0],
            'fill-opacity': 0.1
        }
    },
    {
        id: 'layer-circles-nd',
        source: 'data-circles-nd',
        type: 'fill',
        layout: {
            'fill-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'fill-color': iconColors.nd[0],
            'fill-opacity': 0.1
        }
    },
    {
        id: 'layer-circles-lt',
        source: 'data-circles-lt',
        type: 'fill',
        layout: {
            'fill-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'fill-color': iconColors.lt[0],
            'fill-opacity': 0.1
        }
    },
    {
        id: 'layer-circles-fr',
        source: 'data-circles-fr',
        type: 'fill',
        layout: {
            'fill-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'fill-color': iconColors.fr[0],
            'fill-opacity': 0.1
        }
    }
];

const lineLayers = [
    {
        id: 'layer-lines-od',
        source: 'data-lines-od',
        type: 'line',
        layout: {
            'line-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'line-opacity': 0.8,
            'line-width': 32,
            'line-blur': 1,
            'line-pattern': ['image', 'line']
        }
    },
    {
        id: 'layer-lines-md',
        source: 'data-lines-md',
        type: 'line',
        layout: {
            'line-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'line-opacity': 0.8,
            'line-width': 32,
            'line-blur': 1,
            'line-pattern': ['image', 'line']
        }
    },
    {
        id: 'layer-lines-nd',
        source: 'data-lines-nd',
        type: 'line',
        layout: {
            'line-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'line-opacity': 0.8,
            'line-width': 32,
            'line-blur': 1,
            'line-pattern': ['image', 'line']
        }
    },
    {
        id: 'layer-lines-lt',
        source: 'data-lines-lt',
        type: 'line',
        layout: {
            'line-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'line-opacity': 0.8,
            'line-width': 32,
            'line-blur': 1,
            'line-pattern': ['image', 'line']
        }
    },
    {
        id: 'layer-lines-fr',
        source: 'data-lines-fr',
        type: 'line',
        layout: {
            'line-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'line-opacity': 0.8,
            'line-width': 32,
            'line-blur': 1,
            'line-pattern': ['image', 'line']
        }
    }
];

const dashLayers = [
    {
        id: 'layer-dashes-od',
        source: 'data-dashes-od',
        type: 'line',
        layout: {
            'line-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'line-opacity': 0.8,
            'line-width': 32,
            'line-blur': 1,
            'line-pattern': ['image', 'dash']
        }
    },
    {
        id: 'layer-dashes-md',
        source: 'data-dashes-md',
        type: 'line',
        layout: {
            'line-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'line-opacity': 0.8,
            'line-width': 32,
            'line-blur': 1,
            'line-pattern': ['image', 'dash']
        }
    },
    {
        id: 'layer-dashes-nd',
        source: 'data-dashes-nd',
        type: 'line',
        layout: {
            'line-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'line-opacity': 0.8,
            'line-width': 32,
            'line-blur': 1,
            'line-pattern': ['image', 'dash']
        }
    },
    {
        id: 'layer-dashes-lt',
        source: 'data-dashes-lt',
        type: 'line',
        layout: {
            'line-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'line-opacity': 0.8,
            'line-width': 32,
            'line-blur': 1,
            'line-pattern': ['image', 'dash']
        }
    },
    {
        id: 'layer-dashes-fr',
        source: 'data-dashes-fr',
        type: 'line',
        layout: {
            'line-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'line-opacity': 0.8,
            'line-width': 32,
            'line-blur': 1,
            'line-pattern': ['image', 'dash']
        }
    }
];