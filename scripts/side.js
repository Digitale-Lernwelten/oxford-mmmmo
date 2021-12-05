const sideHome = document.getElementById('side-home');
const sideEntries = document.getElementById('side-entries');

const sideMechthildDE = document.getElementById('side-mechthild-de');
const sideMonasteryDE = document.getElementById('side-monastery-de');
const sideLiberDE = document.getElementById('side-liber-de');
const sideMysticDE = document.getElementById('side-mystic-de');
const sideInfoDE = document.getElementById('side-info-de');
const sideControlsDE = document.getElementById('side-controls-de');
const sideImpressDE = document.getElementById('side-impress-de');
const sidePrivacyDE = document.getElementById('side-privacy-de');

const sideMechthildEN = document.getElementById('side-mechthild-en');
const sideMonasteryEN = document.getElementById('side-monastery-en');
const sideLiberEN = document.getElementById('side-liber-en');
const sideMysticEN = document.getElementById('side-mystic-en');
const sideInfoEN = document.getElementById('side-info-en');
const sideControlsEN = document.getElementById('side-controls-en');
const sideImpressEN = document.getElementById('side-impress-en');
const sidePrivacyEN = document.getElementById('side-privacy-en');

const sideContentPanels = [
    sideMechthildDE, sideMonasteryDE, sideLiberDE, sideMysticDE, sideInfoDE, sideImpressDE, sidePrivacyDE,
    sideMechthildEN, sideMonasteryEN, sideLiberEN, sideMysticEN, sideInfoEN, sideImpressEN, sidePrivacyEN
];

const contentMechthildDE = [];
const contentMonasteryDE = [];
const contentLiberDE = [];
const contentMysticDE = [];
const contentInfoDE = [];
const contentImpressDE = [];
const contentPrivacyDE = [];

const contentMechthildEN = [];
const contentMonasteryEN = [];
const contentLiberEN = [];
const contentMysticEN = [];
const contentInfoEN = [];
const contentImpressEN = [];
const contentPrivacyEN = [];

const contentAll = [
    contentMechthildDE, contentMonasteryDE, contentLiberDE, contentMysticDE, contentInfoDE, contentImpressDE, contentPrivacyDE,
    contentMechthildEN, contentMonasteryEN, contentLiberEN, contentMysticEN, contentInfoEN, contentImpressEN, contentPrivacyEN
];

let activeTab = document.getElementById('tab-od');
let activeSide = 'side-home';
let german = true;

function importContent() {
    Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=358091174&single=true&output=csv', {
        download: true, complete: (results) => {
            for (i = 2; i < results.data.length; i++) {
                if (results.data[i][3] !== null) {
                    contentMechthildDE.push([results.data[i][2], results.data[i][3]]);
                    contentMechthildEN.push([results.data[i][2], results.data[i][4]]);
                }
                if (results.data[i][6] !== null) {
                    contentMonasteryDE.push([results.data[i][5], results.data[i][6]]);
                    contentMonasteryEN.push([results.data[i][5], results.data[i][7]]);
                }
                if (results.data[i][9] !== null) {
                    contentLiberDE.push([results.data[i][8], results.data[i][9]]);
                    contentLiberEN.push([results.data[i][8], results.data[i][10]]);
                }
                if (results.data[i][12] !== null) {
                    contentMysticDE.push([results.data[i][11], results.data[i][12]]);
                    contentMysticEN.push([results.data[i][11], results.data[i][13]]);
                }
                if (results.data[i][15] !== null) {
                    contentInfoDE.push([results.data[i][14], results.data[i][15]]);
                    contentInfoEN.push([results.data[i][14], results.data[i][16]]);
                }
                if (results.data[i][18] !== null) {
                    contentImpressDE.push([results.data[i][17], results.data[i][18]]);
                    contentImpressEN.push([results.data[i][17], results.data[i][19]]);
                }
                if (results.data[i][21] !== null) {
                    contentPrivacyDE.push([results.data[i][20], results.data[i][21]]);
                    contentPrivacyEN.push([results.data[i][20], results.data[i][22]]);
                }
            }
            renderContent();
        }
    });
}

function renderContent() {
    for (let i = 0; i < contentAll.length; i++) {
        for (let j = 0; j < contentAll[i].length; j++) {
            if (contentAll[i][j][0] === 'h1' || contentAll[i][j][0] === 'h2' || contentAll[i][j][0] === 'h3' || contentAll[i][j][0] === 'h4' || contentAll[i][j][0] === 'p' || contentAll[i][j][0] === 'ul' || contentAll[i][j][0] === 'ol' || contentAll[i][j][0] === 'blockquote') {
                const newElement = document.createElement(contentAll[i][j][0]);
                newElement.innerHTML = contentAll[i][j][1];
                sideContentPanels[i].appendChild(newElement);
            } else if (contentAll[i][j][0] === 'hr') {
                const newElement = document.createElement(contentAll[i][j][0]);
                sideContentPanels[i].appendChild(newElement);
            } else if (contentAll[i][j][0] === 'img') {
                const newFigure = document.createElement('figure');
                const newImage = document.createElement('img');
                newImage.src = contentAll[i][j][1];
                newFigure.appendChild(newImage);
                if (contentAll[i][j + 1][0] === 'figcaption') {
                    const newCaption = document.createElement('figcaption');
                    newCaption.innerHTML = contentAll[i][j + 1][1];
                    newFigure.appendChild(newCaption);
                }
                sideContentPanels[i].appendChild(newFigure);
            }
        }
    }
}

function toggleSide(sideName) {
    activeSide = sideName;
    const langSides = ['side-mechthild', 'side-monastery', 'side-mystic', 'side-liber', 'side-info', 'side-impress', 'side-privacy'];
    if (langSides.includes(sideName)) {
        if (german) {
            sideName += '-de';
        } else {
            sideName += '-en';
        }
    }
    let sidePanels = document.getElementsByClassName('side-panel');
    for (let i = 0; i < sidePanels.length; i++) {
        sidePanels[i].style.display = 'none';
    }
    document.getElementById(sideName).style.display = 'block';
}

function openTab(tabLink, tabName, bgColor) {
    let tablinks = document.getElementsByClassName('tablink');
    let tabcontent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
        tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    activeTab = document.getElementById(tabName);
    activeTab.style.display = 'block';
    document.getElementById(tabLink).className += ' active';
    const tablinkContainer = document.getElementById('tablinks');
    tablinkContainer.style.backgroundColor = bgColor;

    showActiveEntries();
}

function changeLang(l) {
    german = l;
    if (german) {
        document.querySelectorAll('.lang-select-de').forEach(e => e.style.color = '#7B27B2');
        document.querySelectorAll('.lang-select-en').forEach(e => e.style.color = '#7B7B7B');
    } else {
        document.querySelectorAll('.lang-select-de').forEach(e => e.style.color = '#7B7B7B');
        document.querySelectorAll('.lang-select-en').forEach(e => e.style.color = '#27B27B');
    }
    toggleSide(activeSide);
}

function showActiveEntries() {
    const entries = activeTab.firstElementChild.lastElementChild.children;
    const currentYear = slider.value;

    // set display 'none' for multiple entries (16a, 16b etc.)
    entryGroups.forEach((eg) => {
        console.log('set display for entry group: ', eg);
        const groupedEntries = document.getElementsByClassName(eg);
        console.log('got entries: ', groupedEntries);
        let displayedEntry;
        let displayedEntryYear = 0;
        for (let i = 0; i < groupedEntries.length; i++) {
            groupedEntries[i].style.display = 'none';
            const entryYear = getItem('i' + groupedEntries[i].id).properties.year;
            if (i === 0 || (entryYear > displayedEntryYear && entryYear <= currentYear)) {
                displayedEntry = groupedEntries[i];
                displayedEntryYear = entryYear;
            }
        }
        displayedEntry.style.display = 'table-row';
    });

    if ((activeTab.id === 'tab-od' && !checkboxOD.checked) ||
        (activeTab.id === 'tab-md' && !checkboxMD.checked) ||
        (activeTab.id === 'tab-nd' && !checkboxND.checked) ||
        (activeTab.id === 'tab-lt' && !checkboxLT.checked) ||
        (activeTab.id === 'tab-fr' && !checkboxFR.checked)) {
        console.log('set all inactive');
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].nodeName === 'TR') {
                const item = getItem('i' + entries[i].id);
                entries[i].className += ' inactive';
            }
        }
    } else {
        console.log('grey entries');
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].nodeName === 'TR') {
                entries[i].className = entries[i].className.replace(' inactive', '');
                const item = getItem('i' + entries[i].id);
                if (item.properties.year > currentYear || !orders.includes(item.properties.order)) {
                    entries[i].className += ' inactive';
                }
            }
        }
    }
}

importContent();
toggleSide('side-home');

function showMultipleEntries() {
    const multipleEntriesTable = document.getElementById('table-multiple-entries');
    multipleEntriesTable.innerHTML = '';

    const multipleEntryCoords = getItem('i' + selectedFeatures[0]).geometry.coordinates;
    console.log('fly to coords: ', multipleEntryCoords);
    let z = map.getZoom();
    if (z < 8) {
        z = 8;
    }

    map.flyTo({
        center: multipleEntryCoords,
        zoom: z/*,
        curve: 1*/
    });

    for (let i = selectedFeatures.length - 1; i >= 0; i--) {
        const item = getItem('i' + selectedFeatures[i]);
        console.log('got item: ', item);
        const newTR = document.createElement('tr');
        //newTR.setAttribute('id', item.properties.id);
        newTR.className = 'row-entry';
        newTR.role = 'button';
        newTR.onclick = function () { showEntryInfo(item.properties.id, newTR.className); };
        const orderImg = returnIcon(item.properties.order);
        let bgColor = '';
        let className = '';
        switch (item.properties.id.substr(0, 2)) {
            case 'od':
                bgColor = '#277BB2';
                className = 'archive-entry-od';
                break;
            case 'md':
                bgColor = '#7B27B2';
                className = 'archive-entry-md';
                break;
            case 'nd':
                bgColor = '#B2277B';
                className = 'archive-entry-nd';
                break;
            case 'lt':
                bgColor = '#B27B27';
                className = 'archive-entry-lt';
                break;
            case 'fr':
                bgColor = '#27B27B';
                className = 'archive-entry-fr';
                break;
            default:
                bgColor = '#272727';
                console.log('background color not defined for: ', item.properties.id.substr(0, 2));
        }
        newTR.innerHTML = '<td><img src="assets/orders-svg/' + orderImg + '.svg" alt="icon ' + item.properties.order + '" style="background-color: ' + bgColor + ';"></td><td class="' + className + '">' + item.properties.name + '</td>';
        multipleEntriesTable.appendChild(newTR);
    }
    toggleSide('side-multiple-entries');
}

function showArchiveEntries(archiveID) {
    // wipe table
    const archiveTable = document.getElementById('table-archive');
    archiveTable.innerHTML = '';

    const archiveName = archiveID.split('*')[1];
    if (archives[archiveName]) {
        if (slider.value === slider.max) {
            // center camera to archive
            const archiveCoords = getItem(archiveID).geometry.coordinates;
            let z = map.getZoom();
            if (z < 8) {
                z = 8;
            }

            map.flyTo({
                center: archiveCoords,
                zoom: z,
                curve: 1
            });
        }

        // set h1
        document.getElementById('archive-name').innerHTML = archiveName;

        console.log('ids in this archive: ', archives[archiveName]);
        for (let i = 0; i < archives[archiveName].length; i++) {
            const item = getItem('i' + archives[archiveName][i]);
            console.log('got item: ', item);
            const newTR = document.createElement('tr');
            newTR.setAttribute('id', item.properties.id);
            newTR.className = 'row-entry';
            newTR.role = 'button';
            newTR.onclick = function () { showEntryInfo(newTR.id, newTR.className); };
            const orderImg = returnOrderSVG(item.properties.order);
            let bgColor = '';
            let className = '';
            switch (item.properties.id.substr(0, 2)) {
                case 'od':
                    bgColor = '#277BB2';
                    className = 'archive-entry-od';
                    break;
                case 'md':
                    bgColor = '#7B27B2';
                    className = 'archive-entry-md';
                    break;
                case 'nd':
                    bgColor = '#B2277B';
                    className = 'archive-entry-nd';
                    break;
                case 'lt':
                    bgColor = '#B27B27';
                    className = 'archive-entry-lt';
                    break;
                case 'fr':
                    bgColor = '#27B27B';
                    className = 'archive-entry-fr';
                    break;
                default:
                    bgColor = '#272727';
                    console.log('background color not defined for: ', item.properties.id.substr(0, 2));
            }
            newTR.innerHTML = '<td>' + orderImg +/*<img src="assets/orders-svg/' + orderImg + '.svg" alt="icon ' + item.properties.order + '" style="background-color: ' + bgColor + ';">*/'</td><td class="' + className + '">' + item.properties.name + '</td>';
            console.log('order img: ', orderImg);
            archiveTable.appendChild(newTR);
        }
        toggleSide('side-archive');
    } else {
        console.log('archive not found: ', archiveName, 'in', archives);
    }
}

function showEntryInfo(entryID, cn) {
    toggleSide('side-entry');
    const item = getItem('i' + entryID);
    document.getElementById('entry-name').innerHTML = item.properties.name;
    //document.getElementById('entry-archive').innerHTML = item.properties.archive;

    if (!cn.includes('inactive')) {
        console.log('fly to: ', item.geometry.coordinates);
        let z = map.getZoom();
        if (z < 8) {
            z = 8;
        }

        map.flyTo({
            center: item.geometry.coordinates,
            zoom: z,
            curve: 1
        });
    }

    let orderImg = returnOrderSVG(item.properties.order);
    
    const entryLang = entryID.substring(0, 2);
    switch (entryLang) {
        case 'od':
            //orderIcon.style.backgroundColor = iconColors.od;
            document.getElementById('entry-label-text-lang').innerHTML = 'Oberdeutsch';
            break;
        case 'md':
            //orderIcon.style.backgroundColor = iconColors.md;
            document.getElementById('entry-label-text-lang').innerHTML = 'Mitteldeutsch';
            break;
        case 'nd':
            //orderIcon.style.backgroundColor = iconColors.nd;
            document.getElementById('entry-label-text-lang').innerHTML = 'Niederdeutsch';
            break;
        case 'lt':
            //orderIcon.style.backgroundColor = iconColors.lt;
            document.getElementById('entry-label-text-lang').innerHTML = 'Latein';
            break;
        case 'fr':
            //orderIcon.style.backgroundColor = iconColors.fr;
            document.getElementById('entry-label-text-lang').innerHTML = 'Sonstige';
            break;
    }

    //orderIcon.src = 'assets/orders-svg/' + orderImg + '.svg';
    //orderIcon.alt = 'Icon ' + item.properties.order;
    document.getElementById('entry-label-text-order').innerHTML = item.properties.order;

    itemCategory = document.getElementById('entry-category');
    itemDate = document.getElementById('entry-date');
    itemLocation = document.getElementById('entry-location');
    itemExtract = document.getElementById('entry-extract');
    itemDescription = document.getElementById('entry-description');

    itemCategory.innerHTML = '–';
    itemDate.innerHTML = '–';
    itemLocation.innerHTML = '–';
    itemExtract.innerHTML = '–';
    itemDescription.innerHTML = '–';

    if (item.properties.category) {
        document.getElementById('entry-category').innerHTML = item.properties.category;
    }
    if (item.properties.date) {
        console.log('write date: ', item.properties.date);
        document.getElementById('entry-date').innerHTML = item.properties.date;
    }
    if (item.properties.location) {
        document.getElementById('entry-location').innerHTML = item.properties.location;
    }
    if (item.properties.extract) {
        document.getElementById('entry-extract').innerHTML = item.properties.extract;
    }
    if (item.properties.description) {
        document.getElementById('entry-description').innerHTML = item.properties.description;
    }

    if (item.properties.hsc !== '') {
        if (item.properties.hsc.substring(0, 4) === 'http') {
            document.getElementById('entry-hsc').innerHTML = 'HSC: <a href="' + item.properties.hsc + '" target="_blank">' + item.properties.hsc + '</a>';
        } else {
            document.getElementById('entry-hsc').innerHTML = 'HSC: ' + item.properties.hsc;
        }
    } else {
        document.getElementById('entry-hsc').innerHTML = 'HSC: –';
    }

    if (item.properties.catalog !== '') {
        if (item.properties.catalog.substring(0, 4) === 'http') {
            document.getElementById('entry-catalog').innerHTML = 'Katalog: <a href="' + item.properties.catalog + '" target="_blank">' + item.properties.catalog + '</a>';
        } else {
            document.getElementById('entry-catalog').innerHTML = 'Katalog: ' + item.properties.catalog;
        }
    } else {
        document.getElementById('entry-catalog').innerHTML = 'Katalog: –';
    }

    if (item.properties.digitalisat !== '') {
        if (item.properties.digitalisat.substring(0, 4) === 'http') {
            document.getElementById('entry-digitalisat').innerHTML = 'Digitalisat: <a href="' + item.properties.digitalisat + '" target="_blank">' + item.properties.digitalisat + '</a>';
        } else {
            document.getElementById('entry-digitalisat').innerHTML = 'Digitalisat: ' + item.properties.digitalisat;
        }
    } else {
        document.getElementById('entry-digitalisat').innerHTML = 'Digitalisat: –';
    }

    const references = document.getElementById('entry-references');
    document.querySelectorAll('.additional-reference').forEach(e => e.parentNode.removeChild(e));
    /*if (item.properties.references !== '') {
        if (item.properties.references.substring(0, 4) === '<li>') {
            const ref = document.createElement('template');
            ref.innerHTML = item.properties.references;
            re
            console.log('template: ', ref, ' template content: ', ref.content);
            referencesUL.appendChild(ref.content);
        } else {
            const ref = document.createElement('li');
            ref.innerHTML = item.properties.references;
            referencesUL.appendChild(ref);
        }
    }*/
    if (item.properties.references !== '') {
        const refs = item.properties.references.split('- ');
        refs.forEach((r) => {
            if (r !== '') {
                const ref = document.createElement('li');
                ref.className = 'additional-reference';
                ref.innerHTML = r;
                references.appendChild(ref);
            }
        });
    }
}