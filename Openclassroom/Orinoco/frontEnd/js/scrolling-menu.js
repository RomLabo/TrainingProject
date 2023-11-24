const windowWidth = window.innerWidth;
const scrollingMenuBtn = document.getElementById('nav-btn');
let scrollingMenuNav = '';
let scrollingMenuNavState = '';


// Vérifie la taille de la fenêtre pour faire apparaître le menu.
const conditionOfDisplayMenu = (scrollingMenuNav) => {
    scrollingMenuNav = document.getElementById('nav-item');
    windowWidth <= 600 ? scrollingMenuNav.style.display = 'none' : scrollingMenuNav.style.display = 'flex';
}


// Ecoute le changement de taille de la fenêtre.  
window.addEventListener('resize', conditionOfDisplayMenu);


// Fait apparaître les liens de navigation lors de l'appui sur le bouton menu.
const displayScrollingMenu = (scrollingMenuNav) => {
    scrollingMenuNav = document.getElementById('nav-item');
    scrollingMenuNavState = scrollingMenuNav.style.display;
    scrollingMenuNavState == 'flex' ? scrollingMenuNav.style.display = 'none' : scrollingMenuNav.style.display = 'flex';
}


// Ecoute le click sur le bouton menu.
scrollingMenuBtn.addEventListener('click', displayScrollingMenu);