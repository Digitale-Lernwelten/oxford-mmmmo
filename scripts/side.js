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

function importContent() {
    Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vTnv1gJnMcFzdhlg5bjxZNOriERtTk5GiWZwezNkiqFrgnHQzoAEoIlND7enWq1BHt6VggNJeZNxQ07/pub?gid=358091174&single=true&output=csv', {
        download: true, complete: (results) => {
            console.log('import content complete', results);

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

            console.log('read content: ', contentAll);
            renderContent();
        }
    });
}

function renderContent() {
    for (let i = 0; i < contentAll.length; i++) {
        for (let j = 0; j < contentAll[i].length; j++) {
            console.log('create element', contentAll[i][j][0])
            if (contentAll[i][j][0] === 'h1' || contentAll[i][j][0] === 'h2' || contentAll[i][j][0] === 'h3' || contentAll[i][j][0] === 'h4' || contentAll[i][j][0] === 'p' || contentAll[i][j][0] === 'ul' || contentAll[i][j][0] === 'ol' || contentAll[i][j][0] === 'blockquote') {
                const newElement = document.createElement(contentAll[i][j][0]);
                console.log('add content', contentAll[i][j][1]);
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

function toggleMechthild(bool) {
    if (bool) {
        sideHome.style.display = 'none';
        sideMechthild.style.display = 'block';
    } else {
        sideHome.style.display = 'block';
        sideMechthild.style.display = 'none';
    }
}

function toggleMonastery(bool) {
    if (bool) {
        sideHome.style.display = 'none';
        sideMonastery.style.display = 'block';
    } else {
        sideHome.style.display = 'block';
        sideMonastery.style.display = 'none';
    }
}

function toggleLiber(bool) {
    if (bool) {
        sideHome.style.display = 'none';
        sideLiber.style.display = 'block';
    } else {
        sideHome.style.display = 'block';
        sideLiber.style.display = 'none';
    }
}

function toggleMystic(bool) {
    if (bool) {
        sideHome.style.display = 'none';
        sideMystic.style.display = 'block';
    } else {
        sideHome.style.display = 'block';
        sideMystic.style.display = 'none';
    }
}

function toggleInfo(bool) {
    if (bool) {
        sideHome.style.display = 'none';
        sideInfo.style.display = 'block';
    } else {
        sideHome.style.display = 'block';
        sideInfo.style.display = 'none';
    }
}

function toggleImpress(bool) {
    if (bool) {
        sideHome.style.display = 'none';
        sideImpress.style.display = 'block';
    } else {
        sideHome.style.display = 'block';
        sideImpress.style.display = 'none';
    }
}

function togglePrivacy(bool) {
    if (bool) {
        sideHome.style.display = 'none';
        sidePrivacy.style.display = 'block';
    } else {
        sideHome.style.display = 'block';
        sidePrivacy.style.display = 'none';
    }
}

importContent();

/*function ShowFeatureInfo(name, year, cat, desc) {
    sideHome.style.display = 'none';
    sideInfo.style.display = 'block';
    document.getElementById('feature-name').innerHTML = name;
    document.getElementById('feature-year').innerHTML = year;
    document.getElementById('feature-category').innerHTML = cat;
    document.getElementById('feature-description').innerHTML = desc;
}*/