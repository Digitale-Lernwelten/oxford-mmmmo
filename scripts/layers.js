const orderIcons = ['aug', 'ben', 'dom', 'fra', 'kar', 'kla', 'krz', 'zis', 'son', 'unb'];
const mapIcons = ['lib', 'line', 'dash', 'mult'];

const iconColors = {
    od: '#277BB2',
    md: '#7B27B2',
    nd: '#B2277B',
    lt: '#B27B27',
    fr: '#27B27B',
    darkGrey: '#272727',
    mediumGrey: '#7B7B7B',
    lightGrey: '#B2B2B2'
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
                'Kartäuser', orderIcons[4],
                'Klarissen', orderIcons[5],
                'Kreuzherren', orderIcons[6],
                'Zisterzienser', orderIcons[7],
                'Sonstiges', orderIcons[8],
                'Unbekannt', orderIcons[9],
                /*fallback*/ orderIcons[9]],
            'icon-size': 1,
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            'icon-size': ['interpolate', ['linear'], ['zoom'], 4, 0.2, 14, 0.8],
            'symbol-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'icon-color': iconColors.od,
            'icon-halo-blur': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 14, 1.6],
            'icon-halo-color': iconColors.darkGrey,
            'icon-halo-width': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 14, 1.6],
            'icon-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, ['boolean', ['feature-state', 'selected'], false], 1, ['interpolate', ['linear'], ['get', 'radius'], 10, 0.3, 200, 0.1]]
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
                'Kartäuser', orderIcons[4],
                'Klarissen', orderIcons[5],
                'Kreuzherren', orderIcons[6],
                'Zisterzienser', orderIcons[7],
                'Sonstiges', orderIcons[8],
                'Unbekannt', orderIcons[9],
            /*fallback*/ orderIcons[9]],
            'icon-size': 1,
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            'icon-size': ['interpolate', ['linear'], ['zoom'], 4, 0.2, 14, 0.8],
            'symbol-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'icon-color': iconColors.md,
            'icon-halo-blur': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 14, 1.6],
            'icon-halo-color': iconColors.darkGrey,
            'icon-halo-width': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 14, 1.6],
            'icon-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, ['boolean', ['feature-state', 'selected'], false], 1, ['interpolate', ['linear'], ['get', 'radius'], 10, 0.3, 200, 0.1]]
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
                'Kartäuser', orderIcons[4],
                'Klarissen', orderIcons[5],
                'Kreuzherren', orderIcons[6],
                'Zisterzienser', orderIcons[7],
                'Sonstiges', orderIcons[8],
                'Unbekannt', orderIcons[9],
            /*fallback*/ orderIcons[9]],
            'icon-size': 1,
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            'icon-size': ['interpolate', ['linear'], ['zoom'], 4, 0.2, 14, 0.8],
            'symbol-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'icon-color': iconColors.nd,
            'icon-halo-blur': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 14, 1.6],
            'icon-halo-color': iconColors.darkGrey,
            'icon-halo-width': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 14, 1.6],
            'icon-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, ['boolean', ['feature-state', 'selected'], false], 1, ['interpolate', ['linear'], ['get', 'radius'], 10, 0.3, 200, 0.1]]
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
                'Kartäuser', orderIcons[4],
                'Klarissen', orderIcons[5],
                'Kreuzherren', orderIcons[6],
                'Zisterzienser', orderIcons[7],
                'Sonstiges', orderIcons[8],
                'Unbekannt', orderIcons[9],
            /*fallback*/ orderIcons[9]],
            'icon-size': 1,
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            'icon-size': ['interpolate', ['linear'], ['zoom'], 4, 0.2, 14, 0.8],
            'symbol-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'icon-color': iconColors.lt,
            'icon-halo-blur': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 14, 1.6],
            'icon-halo-color': iconColors.darkGrey,
            'icon-halo-width': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 14, 1.6],
            'icon-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, ['boolean', ['feature-state', 'selected'], false], 1, ['interpolate', ['linear'], ['get', 'radius'], 10, 0.3, 200, 0.1]]
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
                'Kartäuser', orderIcons[4],
                'Klarissen', orderIcons[5],
                'Kreuzherren', orderIcons[6],
                'Zisterzienser', orderIcons[7],
                'Sonstiges', orderIcons[8],
                'Unbekannt', orderIcons[9],
            /*fallback*/ orderIcons[9]],
            'icon-size': 1,
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            'icon-size': ['interpolate', ['linear'], ['zoom'], 4, 0.2, 14, 0.8],
            'symbol-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'icon-color': iconColors.fr,
            'icon-halo-blur': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 14, 1.6],
            'icon-halo-color': iconColors.darkGrey,
            'icon-halo-width': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 14, 1.6],
            'icon-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, ['boolean', ['feature-state', 'selected'], false], 1, ['interpolate', ['linear'], ['get', 'radius'], 10, 0.3, 200, 0.1]]
        }
    }
];

const multipleIconsLayer = {
    id: 'layer-icons-mult',
    source: 'data-icons-mult',
    type: 'symbol',
    layout: {
        'text-field': ['get', 'count'],
        //'text-font': ['D-DIN-PRO', 'sans-serif'],
        'text-allow-overlap': true,
        'text-ignore-placement': true,
        'text-size': ['interpolate', ['linear'], ['zoom'], 4, 12, 14, 24],
    },
    paint: {
        'text-color': iconColors.darkGrey,
        'text-translate': ['interpolate', ['linear'], ['zoom'], 4, ['literal', [6, -6]], 14, ['literal', [24, -24]]],
        'text-halo-blur': ['interpolate', ['linear'], ['zoom'], 4, 1, 14, 2],
        'text-halo-color': '#fff',
        'text-halo-width': ['interpolate', ['linear'], ['zoom'], 4, 1, 14, 2],
    }
}

const archiveIconLayer = {
    id: 'layer-icons-lib',
    source: 'data-icons-lib',
    type: 'symbol',
    layout: {
        'icon-image': mapIcons[0],
        'icon-size': 1,
        'icon-allow-overlap': true,
        'icon-size': ['interpolate', ['linear'], ['zoom'], 4, 0.25, 14, 1],
        'visibility': 'visible'
    },
    paint: {
        'icon-color': iconColors.darkGrey,
        'icon-halo-blur': ['interpolate', ['linear'], ['zoom'], 4, 0.5, 14, 2],
        'icon-halo-color': iconColors.darkGrey,
        'icon-halo-width': ['interpolate', ['linear'], ['zoom'], 4, 0.5, 14, 2],
        'icon-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, ['boolean', ['feature-state', 'selected'], false], 1, 0.6]
    }
}

const circleLayers = [
    {
        id: 'layer-circles-od',
        source: 'data-circles-od',
        type: 'fill',
        layout: {
            'fill-sort-key': ['to-number', ['get', 'year']]
        },
        paint: {
            'fill-color': iconColors.od,
            'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.2, ['boolean', ['feature-state', 'selected'], false], 0.2, ['interpolate', ['linear'], ['get', 'radius'], 10, 0.05, 200, 0.02]]
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
            'fill-color': iconColors.md,
            'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.2, ['boolean', ['feature-state', 'selected'], false], 0.2, 0.05]
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
            'fill-color': iconColors.nd,
            'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.2, ['boolean', ['feature-state', 'selected'], false], 0.2, 0.05]
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
            'fill-color': iconColors.lt,
            'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.2, ['boolean', ['feature-state', 'selected'], false], 0.2, 0.05]
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
            'fill-color': iconColors.fr,
            'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.2, ['boolean', ['feature-state', 'selected'], false], 0.2, 0.05]
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
            'line-opacity': 0.1,
            'line-width': 32,
            'line-blur': 1,
            'line-pattern': ['image', mapIcons[1]]
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
            'line-opacity': 0.1,
            'line-width': 32,
            'line-blur': 1,
            'line-pattern': ['image', mapIcons[1]]
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
            'line-opacity': 0.1,
            'line-width': 32,
            'line-blur': 1,
            'line-pattern': ['image', mapIcons[1]]
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
            'line-opacity': 0.1,
            'line-width': 32,
            'line-blur': 1,
            'line-pattern': ['image', mapIcons[1]]
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
            'line-opacity': 0.1,
            'line-width': 32,
            'line-blur': 1,
            'line-pattern': ['image', mapIcons[1]]
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
            'line-opacity': 0.1,
            'line-width': 32,
            'line-blur': 1,
            'line-pattern': ['image', mapIcons[2]]
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
            'line-opacity': 0.1,
            'line-width': 32,
            'line-blur': 1,
            'line-pattern': ['image', mapIcons[2]]
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
            'line-opacity': 0.1,
            'line-width': 32,
            'line-blur': 1,
            'line-pattern': ['image', mapIcons[2]]
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
            'line-opacity': 0.1,
            'line-width': 32,
            'line-blur': 1,
            'line-pattern': ['image', mapIcons[2]]
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
            'line-opacity': 0.1,
            'line-width': 32,
            'line-blur': 1,
            'line-pattern': ['image', mapIcons[2]]
        }
    }
];

const archiveLineLayers = [
    {
        id: 'layer-archive-lines-od',
        source: 'data-archive-lines-od',
        type: 'line',
        paint: {
            'line-opacity': 0.3,
            'line-width': 1,
            'line-blur': 1,
            'line-color': iconColors.darkGrey
        }
    },
    {
        id: 'layer-archive-lines-md',
        source: 'data-archive-lines-md',
        type: 'line',
        paint: {
            'line-opacity': 0.3,
            'line-width': 1,
            'line-blur': 1,
            'line-color': iconColors.darkGrey
        }
    },
    {
        id: 'layer-archive-lines-nd',
        source: 'data-archive-lines-nd',
        type: 'line',
        paint: {
            'line-opacity': 0.3,
            'line-width': 1,
            'line-blur': 1,
            'line-color': iconColors.darkGrey
        }
    },
    {
        id: 'layer-archive-lines-lt',
        source: 'data-archive-lines-lt',
        type: 'line',
        paint: {
            'line-opacity': 0.3,
            'line-width': 1,
            'line-blur': 1,
            'line-color': iconColors.darkGrey
        }
    },
    {
        id: 'layer-archive-lines-fr',
        source: 'data-archive-lines-fr',
        type: 'line',
        paint: {
            'line-opacity': 0.3,
            'line-width': 1,
            'line-blur': 1,
            'line-color': iconColors.darkGrey
        }
    }
];