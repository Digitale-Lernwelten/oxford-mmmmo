const sideHome = document.getElementById('side-home');
const sideEntries = document.getElementById('side-entries');
const sideMechthild = document.getElementById('side-mechthild');
const sideMonastery = document.getElementById('side-monastery');
const sideLiber = document.getElementById('side-liber');
const sideMystic = document.getElementById('side-mystic');
const sideInfo = document.getElementById('side-info');
const sideControls = document.getElementById('side-controls');
const sideImpress = document.getElementById('side-impress');
const sidePrivacy = document.getElementById('side-privacy');
const sideContentPanels = [sideMechthild, sideMonastery, sideLiber, sideMystic, sideInfo, sideImpress, sidePrivacy];

const contentMechthild = [];
const contentMonastery = [];
const contentLiber = [];
const contentMystic = [];
const contentInfo = [];
const contentImpress = [];
const contentPrivacy = [];
const contentAll = [contentMechthild, contentMonastery, contentLiber, contentMystic, contentInfo, contentImpress, contentPrivacy];

let activeTab = document.getElementById('tab-od');

function importContent() {
    Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=358091174&single=true&output=csv', {
        download: true, complete: (results) => {
            for (i = 2; i < results.data.length; i++) {
                if (results.data[i][3] !== null) {
                    contentMechthild.push([results.data[i][2], results.data[i][3]]);
                }
                if (results.data[i][5] !== null) {
                    contentMonastery.push([results.data[i][4], results.data[i][5]]);
                }
                if (results.data[i][7] !== null) {
                    contentLiber.push([results.data[i][6], results.data[i][7]]);
                }
                if (results.data[i][9] !== null) {
                    contentMystic.push([results.data[i][8], results.data[i][9]]);
                }
                if (results.data[i][11] !== null) {
                    contentInfo.push([results.data[i][10], results.data[i][11]]);
                }
                if (results.data[i][13] !== null) {
                    contentImpress.push([results.data[i][12], results.data[i][13]]);
                }
                if (results.data[i][15] !== null) {
                    contentPrivacy.push([results.data[i][14], results.data[i][15]]);
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
    let sidePanels = document.getElementsByClassName('side-panel');
    for (let i = 0; i < sidePanels.length; i++) {
        sidePanels[i].style.display = 'none';
    }
    document.getElementById(sideName).style.display = 'block';
}

function openTab(tabLink, tabName) {
    let tablinks = document.getElementsByClassName('tablink');
    let tabcontent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
        tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    activeTab = document.getElementById(tabName);
    activeTab.style.display = 'block';
    document.getElementById(tabLink).className += ' active';

    showInactiveEntries();
}

function showInactiveEntries() {
    const entries = activeTab.firstElementChild.children;
    const currentYear = slider.value;
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

function showEntryInfo(entryID) {
    console.log('show entry info');
    toggleSide('side-entry');
    const item = getItem('i' + entryID);
    document.getElementById('entry-name').innerHTML = item.properties.name;
    document.getElementById('entry-archive').innerHTML = item.properties.archive;

    const orderIcon = document.getElementById('entry-order-icon');
    let orderImg;
    switch (item.properties.order) {
        case 'Augustiner':
            orderImg = 'icon-aug';
            break;
        case 'Benediktiner':
            orderImg = 'icon-ben';
            break;
        case 'Dominikaner':
            orderImg = 'icon-dom';
            break;
        case 'Franziskaner':
            orderImg = 'icon-fran';
            break;
        case 'Kartäuser':
            orderImg = 'icon-kart';
            break;
        case 'Kreuzherren':
            orderImg = 'icon-kreu';
            break;
        case 'Zisterzienser':
            orderImg = 'icon-zist';
            break;
        case 'Sonstiges':
            orderImg = 'icon-sonst';
            break;
        case 'Unbekannt':
            orderImg = 'icon-unb';
            break;
        default:
            orderImg = 'icon-unb';
            break;
    }

    const entryLang = entryID.substring(0, 2);
    switch (entryLang) {
        case 'od':
            orderIcon.style.backgroundColor = iconColors.od;
            document.getElementById('entry-language-text').innerHTML = 'Oberdeutsche Schrift';
            break;
        case 'md':
            orderIcon.style.backgroundColor = iconColors.md;
            document.getElementById('entry-language-text').innerHTML = 'Mitteldeutsche Schrift';
            break;
        case 'nd':
            orderIcon.style.backgroundColor = iconColors.nd;
            document.getElementById('entry-language-text').innerHTML = 'Niederdeutsche Schrift';
            break;
        case 'lt':
            orderIcon.style.backgroundColor = iconColors.lt;
            document.getElementById('entry-language-text').innerHTML = 'Lateinische Schrift';
            break;
        case 'fr':
            orderIcon.style.backgroundColor = iconColors.fr;
            document.getElementById('entry-language-text').innerHTML = 'Sonstige Schrift';
            break;
    }

    orderIcon.src = 'assets/map/' + orderImg + '.png';
    document.getElementById('entry-order-text').innerHTML = item.properties.order;

    document.getElementById('entry-category').innerHTML = item.properties.category;
    document.getElementById('entry-description').innerHTML = item.properties.description;

    if (item.properties.hsc.substring(0, 4) === 'http') {
        document.getElementById('entry-hsc').innerHTML = 'HSC: <a href="' + item.properties.hsc + '" target="_blank">' + item.properties.hsc + '</a>';
    } else {
        document.getElementById('entry-hsc').innerHTML = 'HSC: ' + item.properties.hsc;
    }

    if (item.properties.catalog.substring(0, 4) === 'http') {
        document.getElementById('entry-catalog').innerHTML = 'Katalog: <a href="' + item.properties.catalog + '" target="_blank">' + item.properties.catalog + '</a>';
    } else {
        document.getElementById('entry-catalog').innerHTML = 'Katalog: ' + item.properties.catalog;
    }

    if (item.properties.digitalisat.substring(0, 4) === 'http') {
        document.getElementById('entry-digitalisat').innerHTML = 'Digitalisat: <a href="' + item.properties.digitalisat + '" target="_blank">' + item.properties.digitalisat + '</a>';
    } else {
        document.getElementById('entry-digitalisat').innerHTML = 'Digitalisat: ' + item.properties.digitalisat;
    }
}