const orderIcons = ['aug', 'ben', 'dom', 'fra', 'kar', 'kla', 'krz', 'zis', 'son', 'unb'];
const mapIcons = ['arrow', 'lib', 'mult'];
const iconColors = { od: '#277BB2', md: '#7B27B2', nd: '#B2277B', lt: '#B27B27', fr: '#27B27B', dg: '#272727', lg: '#7B7B7B' }; // icon colors

// MAPBOX LAYERS
const slLayers = ['country-label', 'state-label']; // state and country labels (get replaced by historical maps if slider.value !== slider.max)
const olLayers = ['natural-line-label', 'natural-point-label', 'poi-label', 'settlement-major-label', 'settlement-minor-label', 'settlement-subdivision-label', 'water-point-label', 'waterway-label']; // other labels
const borderLayers = ['admin-0-boundary', 'admin-0-boundary-bg', 'admin-0-boundary-disputed', 'admin-1-boundary', 'admin-1-boundary-bg']; // borders (get replaced by historical maps if slider.value !== slider.max)
const infLayers = ['aeroway-line', 'aeroway-polygon', 'bridge-major-link', 'bridge-major-link-case', 'bridge-major-link-2', 'bridge-major-link-2-case', 'bridge-motorway-trunk',
    'bridge-motorway-trunk-case', 'bridge-motorway-trunk-2', 'bridge-motorway-trunk-2-case', 'bridge-primary-secondary-tertiary', 'bridge-primary-secondary-tertiary-case', 'bridge-rail',
    'bridge-street-minor', 'bridge-street-minor-case', 'bridge-street-minor-low', 'building', 'building-outline', 'road-intersection', 'road-major-link', 'road-major-link-case', 'road-minor',
    'road-minor-case', 'road-minor-low', 'road-motorway-trunk', 'road-motorway-trunk-case', 'road-primary', 'road-primary-case', 'road-rail', 'road-secondary-tertiary', 'road-secondary-tertiary-case',
    'road-street', 'road-street-case', 'road-street-low', 'tunnel-major-link', 'tunnel-major-link-case', 'tunnel-motorway-trunk', 'tunnel-motorway-trunk-case', 'tunnel-primary-secondary-tertiary',
    'tunnel-primary-secondary-tertiary-case', 'tunnel-street-minor', 'tunnel-street-minor-case', 'tunnel-street-minor-low', 'waterway', 'waterway-shadow']; // infrastructure layers
const histMaps = [1300, 1400, 1500, 1530, 1600, 1650, 1700, 1715, 1800]; // years for which historical map layers exist (numbers will be compared to slider.value to display the latest corresponding name and border layers)

// ENTRY LAYER PROPERTIES
const elLayout = {
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
    'icon-allow-overlap': true,
    'icon-ignore-placement': true,
    'icon-size': ['interpolate', ['linear'], ['zoom'], 4, 0.2, 14, 0.8],
    'symbol-sort-key': ['to-number', ['get', 'year']]
};

const elPaint = ((col100, col050, col020) => {
    return {
        'icon-color': col100/*['case',
            ['boolean', ['feature-state', 'hover'], false], col100,
            ['interpolate', ['linear'], ['get', 'radius'], 10, col050, 200, col020]],
        'icon-halo-blur': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 14, 1.6]*/,
        'icon-halo-width': ['interpolate', ['linear'], ['zoom'], 4, 0.4, 14, 1.6],
        'icon-halo-color': iconColors.dg,
        'icon-opacity': ['case',
            ['boolean', ['feature-state', 'hover'], false], 1,
            ['boolean', ['feature-state', 'mult'], false], 0,
            ['interpolate', ['linear'], ['get', 'radius'], 10, 0.4, 200, 0.15]]
    }
});

// ENTRY LAYERS
const entryLayers = [
    { id: 'el-od', source: 'ed-od', type: 'symbol', layout: elLayout, paint: elPaint(iconColors.od, '#93BDD9', '#D4E5F0') },
    { id: 'el-md', source: 'ed-md', type: 'symbol', layout: elLayout, paint: elPaint(iconColors.md, '#BD93D9', '#E5D4F0') },
    { id: 'el-nd', source: 'ed-nd', type: 'symbol', layout: elLayout, paint: elPaint(iconColors.nd, '#D993BD', '#F0D4E5') },
    { id: 'el-lt', source: 'ed-lt', type: 'symbol', layout: elLayout, paint: elPaint(iconColors.lt, '#D9BD93', '#F0E5D4') },
    { id: 'el-fr', source: 'ed-fr', type: 'symbol', layout: elLayout, paint: elPaint(iconColors.fr, '#93D9BD', '#D4F0E5') }];

// RADIUS LAYER PROPERTIES
const rlLayout = { 'fill-sort-key': ['to-number', ['get', 'year']] };
const rlPaint = ((color) => {
    return {
        'fill-color': color,
        'fill-opacity': ['case',
            ['boolean', ['feature-state', 'hover'], false], 0.2,
            ['boolean', ['feature-state', 'disabled'], false], 0,
            ['interpolate', ['linear'], ['get', 'radius'], 10, 0.05, 200, 0.02]]
    }
});

// RADIUS LAYERS
const radiusLayers = [
    { id: 'rl-od', source: 'rd-od', type: 'fill', layout: rlLayout, paint: rlPaint(iconColors.od) },
    { id: 'rl-md', source: 'rd-md', type: 'fill', layout: rlLayout, paint: rlPaint(iconColors.md) },
    { id: 'rl-nd', source: 'rd-nd', type: 'fill', layout: rlLayout, paint: rlPaint(iconColors.nd) },
    { id: 'rl-lt', source: 'rd-lt', type: 'fill', layout: rlLayout, paint: rlPaint(iconColors.lt) },
    { id: 'rl-fr', source: 'rd-fr', type: 'fill', layout: rlLayout, paint: rlPaint(iconColors.fr) }];

// LINE LAYER PROPERTIES
const lilLayout = { 'line-sort-key': ['to-number', ['get', 'year']] };
const lilPaint = { 'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#7B7B7B', '#B2B2B2'], 'line-width': ['interpolate', ['linear'], ['zoom'], 4, 0.5, 14, 1] };

// LINE LAYERS
const lineLayers = [
    { id: 'lil-od', source: 'lid-od', type: 'line', layout: lilLayout, paint: lilPaint },
    { id: 'lil-md', source: 'lid-md', type: 'line', layout: lilLayout, paint: lilPaint },
    { id: 'lil-nd', source: 'lid-nd', type: 'line', layout: lilLayout, paint: lilPaint },
    { id: 'lil-lt', source: 'lid-lt', type: 'line', layout: lilLayout, paint: lilPaint },
    { id: 'lil-fr', source: 'lid-fr', type: 'line', layout: lilLayout, paint: lilPaint }];

// DASH LAYER PROPERTIES
const dalLayout = { 'line-sort-key': ['to-number', ['get', 'year']] };
const dalPaint = { 'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#7B7B7B', '#B2B2B2'], 'line-width': ['interpolate', ['linear'], ['zoom'], 4, 0.5, 14, 1], 'line-dasharray': [8, 6] };

// DASH LAYERS
const dashLayers = [
    { id: 'dal-od', source: 'dad-od', type: 'line', layout: dalLayout, paint: dalPaint },
    { id: 'dal-md', source: 'dad-md', type: 'line', layout: dalLayout, paint: dalPaint },
    { id: 'dal-nd', source: 'dad-nd', type: 'line', layout: dalLayout, paint: dalPaint },
    { id: 'dal-lt', source: 'dad-lt', type: 'line', layout: dalLayout, paint: dalPaint },
    { id: 'dal-fr', source: 'dad-fr', type: 'line', layout: dalLayout, paint: dalPaint }];

// DOT LAYER PROPERTIES
const dolLayout = { 'line-sort-key': ['to-number', ['get', 'year']] };
const dolPaint = { 'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#7B7B7B', '#939393'], 'line-width': ['interpolate', ['linear'], ['zoom'], 4, 0.5, 14, 1], 'line-dasharray': [2, 6], };

// DOT LAYERS
const dotLayers = [
    { id: 'dol-od', source: 'dod-od', type: 'line', layout: dolLayout, paint: dolPaint },
    { id: 'dol-md', source: 'dod-md', type: 'line', layout: dolLayout, paint: dolPaint },
    { id: 'dol-nd', source: 'dod-nd', type: 'line', layout: dolLayout, paint: dolPaint },
    { id: 'dol-lt', source: 'dod-lt', type: 'line', layout: dolLayout, paint: dolPaint },
    { id: 'dol-fr', source: 'dod-fr', type: 'line', layout: dolLayout, paint: dolPaint }];

// MULT LAYER
const multLayer = {
    id: 'l-mult',
    source: 'd-mult',
    type: 'symbol',
    layout: {
        'icon-image': mapIcons[2],
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
        'icon-size': ['interpolate', ['linear'], ['zoom'], 4, 0.1, 14, 0.4],
    },
    paint: {
        'icon-color': iconColors.dg,
        'icon-translate': ['interpolate', ['linear'], ['zoom'], 4, ['literal', [6, -5]], 14, ['literal', [24, -20]]],
        'icon-halo-blur': ['interpolate', ['linear'], ['zoom'], 4, 0.2, 14, 0.8],
        'icon-halo-width': ['interpolate', ['linear'], ['zoom'], 4, 0.2, 14, 0.8],
        'icon-halo-color': '#FFF',
        'icon-opacity': 0.8
    }
};

// ARROWS (DISPLAYED ON TOP OF LINES ON HOVER)
const arrowLayer = {
    id: 'l-arrow',
    source: 'd-arrow',
    type: 'line',
    paint: { 'line-width': ['interpolate', ['linear'], ['zoom'], 4, 32, 14, 64], 'line-pattern': ['image', mapIcons[0]] }
}

// LIB LAYER
const libLayer = {
    id: 'l-lib',
    source: 'd-lib',
    type: 'symbol',
    layout: {
        'icon-image': mapIcons[1],
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
        'icon-size': ['interpolate', ['linear'], ['zoom'], 4, 0.2, 14, 0.8]
    },
    paint: {
        'icon-color': iconColors.dg,
        'icon-halo-blur': ['interpolate', ['linear'], ['zoom'], 4, 0.5, 14, 2],
        'icon-halo-color': '#FFF',
        'icon-halo-width': ['interpolate', ['linear'], ['zoom'], 4, 0.5, 14, 2],
        'icon-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.4]
    }
}