const sideHome = document.getElementById('side-home');
const sideManuscripts = document.getElementById('side-manuscripts');
const sideMechthild = document.getElementById('side-mechthild');
const sideControls = document.getElementById('side-controls');
const sideInfo = document.getElementById('side-info');
const sidePanels = [sideHome, sideManuscripts, sideMechthild, sideControls, sideInfo];

const navHome = document.getElementById('nav-home');
const navManuscripts = document.getElementById('nav-manuscripts');
const navMechthild = document.getElementById('nav-mechthild');
const navControls = document.getElementById('nav-controls');
const navElements = [navHome, navManuscripts, navMechthild, navControls];

function backToHome() {
    sideInfo.style.display = "none";
    sideHome.style.display = "block";
}

function ShowFeatureInfo (name, year, cat, desc) {
    sideHome.style.display = "none";
    sideInfo.style.display = "block";
    document.getElementById('feature-name').innerHTML = name;
    document.getElementById('feature-year').innerHTML = year;
    document.getElementById('feature-category').innerHTML = cat;
    document.getElementById('feature-description').innerHTML = desc;
}

function NavControls(value) {
    sideInfo.style.display = 'none';
    for (let i=  0; i < navElements.length; i++) {
        navElements[i].style.borderBottomColor = 'white';
        sidePanels[i].style.display = 'none';
        if (navElements[i] === value) {
            navElements[i].style.borderBottomColor = '#2772d7';
            sidePanels[i].style.display = 'block';
        }
    }
}