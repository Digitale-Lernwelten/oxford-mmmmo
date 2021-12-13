// PANELS AND CONTENT ARRAYS FOR DATA THAT IS IMPORTED FROM GOOGLE SHEET
const sideContentPanels = [document.getElementById('mechthild-content-de'), document.getElementById('mechthild-content-en'), document.getElementById('monas-content-de'), document.getElementById('monas-content-en'),
document.getElementById('liber-content-de'), document.getElementById('liber-content-en'), document.getElementById('mystic-content-de'), document.getElementById('mystic-content-en'), document.getElementById('info-content-de'),
document.getElementById('info-content-en'), document.getElementById('legal-content-de'), document.getElementById('legal-content-en'), document.getElementById('privacy-content-de'), document.getElementById('privacy-content-en')];
const content = [[/* 0: mechthild-de */], [/* 1: mechthild-en */], [/* 2: monas-de */], [/* 3: monas-en */], [/* 4: liber-de */], [/* 5: liber-en */], [/* 6: mystic-de */], [/* 7: mystic-en */], [/* 8: info-de */],
[/* 9: info-en */], [/* 10: legal-de */], [/* 11: legal-en */], [/* 12: privacy-de */], [/* 13: privacy-en */]];

let activeSide = 'side-home'; // side panel that is currently shown
let prevSide = 'side-home'; // previous side that was shown (to go back from entry to entry list, lib list or mult list)
let activeTab; // active tab to display on side entries
let german = true; // store selected language as bool: true = german, false = english

let selectedLibSide; // stores currently selected lib to update lib list after changing filters (year, lang, order)
let selectedMultSide = [] // stores currently selected mult entries to update mult list after changing filters (year, lang, order)

function importContent() {
    Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=358091174&single=true&output=csv', {
        download: true, complete: (results) => {
            for (let i = 2; i < results.data.length; i++) {
                if (results.data[i][2] !== null) {
                    content[0].push([results.data[i][2], results.data[i][3]]);
                    content[1].push([results.data[i][2], results.data[i][4]]);
                }
                if (results.data[i][5] !== null) {
                    content[2].push([results.data[i][5], results.data[i][6]]);
                    content[3].push([results.data[i][5], results.data[i][7]]);
                }
                if (results.data[i][8] !== null) {
                    content[4].push([results.data[i][8], results.data[i][9]]);
                    content[5].push([results.data[i][8], results.data[i][10]]);
                }
                if (results.data[i][11] !== null) {
                    content[6].push([results.data[i][11], results.data[i][12]]);
                    content[7].push([results.data[i][11], results.data[i][13]]);
                }
                if (results.data[i][14] !== null) {
                    content[8].push([results.data[i][14], results.data[i][15]]);
                    content[9].push([results.data[i][14], results.data[i][16]]);
                }
                if (results.data[i][17] !== null) {
                    content[10].push([results.data[i][17], results.data[i][18]]);
                    content[11].push([results.data[i][17], results.data[i][19]]);
                }
                if (results.data[i][20] !== null) {
                    content[12].push([results.data[i][20], results.data[i][21]]);
                    content[13].push([results.data[i][20], results.data[i][22]]);
                }
            }
            renderContent();
        }
    });
}

function renderContent() {
    for (let i = 0; i < content.length; i++) {
        sideContentPanels[i].innerHTML = '';
        for (let j = 0; j < content[i].length; j++) {
            const c = content[i][j][0];
            if (c === 'h1' || c === 'h2' || c === 'h3' || c === 'p' || c === 'ul' || c === 'ol' || c === 'blockquote') {
                const el = document.createElement(c);
                el.innerHTML = content[i][j][1];
                sideContentPanels[i].appendChild(el);
            }

            else if (c === 'hr') {
                const el = document.createElement(c);
                sideContentPanels[i].appendChild(el);
            }

            else if (c === 'img') {
                const fig = document.createElement('figure');
                const img = document.createElement('img');
                img.src = content[i][j][1];
                fig.appendChild(img);

                if (content[i][j + 1][0] === 'figcaption') {
                    const cap = document.createElement('figcaption');
                    cap.innerHTML = content[i][j + 1][1];
                    fig.appendChild(cap);
                }
                sideContentPanels[i].appendChild(fig);
            }
        }
    }
}

function switchLang(l) {
    german = l;
    if (l) {
        //document.querySelectorAll('.lang-de').forEach(e => e.className.replace(' ds-none', ''));
        //document.querySelectorAll('.lang-en').forEach(e => e.className += ' ds-none');
        document.querySelectorAll('.lang-side-de').forEach(e => e.style.color = '#7B27B2');
        document.querySelectorAll('.lang-side-en').forEach(e => e.style.color = '#7B7B7B');
    } else {
        document.querySelectorAll('.lang-side-de').forEach(e => e.style.color = '#7B7B7B');
        document.querySelectorAll('.lang-side-en').forEach(e => e.style.color = '#27B27B');
        //document.querySelectorAll('.lang-de').forEach(e => e.className += ' ds-none');
        //document.querySelectorAll('.lang-en').forEach(e => e.className.replace(' ds-none', ''));
    }
    document.querySelectorAll('.lang-de, .lang-en').forEach(e => e.classList.toggle('ds-none'));
    toggleSide(activeSide);
}

function toggleSide(s) {
    //s === activeSide ? prevSide = 'side-home' : prevSide = activeSide;
    activeSide = s;

    const langSides = ['side-mechthild', 'side-monas', 'side-mystic', 'side-liber', 'side-info', 'side-options', 'side-legal', 'side-privacy'];
    if (langSides.includes(s)) german ? s += '-de' : s += '-en';

    let sp = document.querySelectorAll('.side-panel');
    for (let i = 0; i < sp.length; i++) {
        sp[i].style.display = 'none';
    }
    document.getElementById(s).style.display = 'block';
}

function openTab(tl, tn, c) {
    const tablinks = document.querySelectorAll('.tablink');
    const tabcontent = document.querySelectorAll('.tabcontent');

    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
        tablinks[i].className = tablinks[i].className.replace(' active', '');
    }

    activeTab = document.getElementById(tn);
    activeTab.style.display = 'block';
    document.getElementById(tl).className += ' active';
    document.getElementById('tablink-container').style.backgroundColor = c;

    displayEntries();
}

function displayEntries() {
    const entries = activeTab.querySelectorAll('li > div');

    if ((activeTab.id === 'tab-od' && !cbLang[0].checked) ||
        (activeTab.id === 'tab-md' && !cbLang[1].checked) ||
        (activeTab.id === 'tab-nd' && !cbLang[2].checked) ||
        (activeTab.id === 'tab-lt' && !cbLang[3].checked) ||
        (activeTab.id === 'tab-fr' && !cbLang[4].checked)) {
        for (let i = 0; i < entries.length; i++) {
            entries[i].className += ' inactive';
        }
    }

    else {
        for (let i = 0; i < entries.length; i++) {
            entries[i].className = entries[i].className.replace(' inactive', '');
            const e = features[parseInt(entries[i].id)];
            if (e.properties.year > slider.value || !orders.includes(e.properties.order)) {
                entries[i].className += ' inactive';
            }
        }
    }
}

function displayLibEntries(l, fly) {
    selectedLibSide = l;
    selected = true;
    const listLib = document.getElementById('list-lib');
    listLib.innerHTML = '';

    if (fly) setCam(features[l].geometry.coordinates);

    document.getElementById('lib-name').innerHTML = features[l].properties.name;
    for (let i = 0; i < features[l].properties.entries.length; i++) {
        pushToList(features[features[l].properties.entries[i]], listLib, '-lib');
    }
    toggleSide('side-lib');
}

function displayMultEntries(sf, fly) {
    selectedMultSide = sf;
    const listMult = document.getElementById('list-mult');
    listMult.innerHTML = '';

    if (fly) setCam(sf[0].geometry.coordinates);

    // if one entry of selected features is a moved entry, push other moved entries for the same manuscript to selected features
    const cm = [...sf]; // store features in temporary variable, so the original won't be modified while being iterated
    for (let i = 0; i < sf.length; i++) {
        if (sf[i] !== null) {
            if (isNaN(sf[i].properties.pid.slice(-1))) {
                movedEntries[sf[i].properties.pid.substring(0, sf[i].properties.pid.length - 1)].forEach((m) => {
                    // alternative to sorting the array: remove the existing feature and then push all features, so they appear in the correct order
                    if (sf[i].id === m) {
                        cm.splice(i, 1, null);
                    }
                    cm.push(features[m]);
                });
            }
        }
    }
    cm.forEach((c) => { if (c !== null) pushToList(c, listMult, '-mult'); });
    toggleSide('side-mult');
    console.log('display mult entries end. sf: ', sf, ' selectedMultSide: ', selectedMultSide);
}

function displayEntry(id, cn) {
    selected = true;
    setEntryHover(features[id]);

    if (!cn.includes('inactive')) setCam(features[id].geometry.coordinates);

    document.getElementById('entry-sig').innerHTML = features[id].properties.sig;
    document.getElementById('entry-l-text-lang').innerHTML = returnLang(features[id].properties.pid.substring(0, 2));
    document.getElementById('entry-l-text-order').innerHTML = features[id].properties.order;

    const labelIcon = document.getElementById('entry-l-icon');
    labelIcon.innerHTML = returnOrderSVG(features[id].properties.order);
    labelIcon.className = 'icon-' + features[id].properties.pid.substring(0, 2);

    const textData = [features[id].properties.category, features[id].properties.date, features[id].properties.loc, features[id].properties.extract, features[id].properties.desc];
    const textElements = [document.getElementById('entry-category'), document.getElementById('entry-date'), document.getElementById('entry-loc'), document.getElementById('entry-extract'), document.getElementById('entry-desc')];
    for (let i = 0; i < textData.length; i++) {
        if (textData[i] !== '') {
            textElements[i].innerHTML = textData[i];
        } else {
            textElements[i].innerHTML = '–';
        }
    }

    const refData = [features[id].properties.hsc, features[id].properties.catalog, features[id].properties.dig];
    const refElements = [document.getElementById('entry-hsc'), document.getElementById('entry-catalog'), document.getElementById('entry-dig')];
    const refPrefix = ['HSC: ', 'Katalog: ', 'Digitalisat: '];
    for (let i = 0; i < refData.length; i++) {
        if (refData[i] !== '') {
            if (refData[i].substring(0, 4) == 'http') {
                refElements[i].innerHTML = `${refPrefix[i]}<a href="${refData[i]}" target="_blank">${refData[i]}</a>`;
            } else {
                refElements[i].innerHTML = refPrefix[i] + refData[i];
            }
        } else {
            refElements[i].innerHTML = `${refPrefix[i]}–`;
        }
    }

    const refElement = document.getElementById('entry-ref');
    document.querySelectorAll('.add-ref').forEach(e => e.parentNode.removeChild(e)); // wipe additional references
    if (features[id].references !== '') {
        const refs = features[id].properties.ref.split('- ');
        refs.forEach((r) => {
            if (r !== '') {
                const ref = document.createElement('li');
                ref.className = 'add-ref';
                ref.innerHTML = r;
                refElement.appendChild(ref);
            }
        });
    }
    toggleSide('side-entry');
}

function returnLang(l) {
    switch (l) {
        case 'od': return 'Oberdeutsch';
        case 'md': return 'Mitteldeutsch';
        case 'nd': return 'Niederdeutsch';
        case 'lt': return 'Latein';
        case 'fr': return 'Sonstige';
    }
}

importContent();
toggleSide('side-home');