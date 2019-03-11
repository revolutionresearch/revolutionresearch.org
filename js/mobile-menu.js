const desktopWidth = 1024;
const mobileMenuButton = document.getElementById('mobile-menu-button');
const openClass = 'mobile-menu-open';

function toggleMobileMenu() {
    if (window.innerWidth <= desktopWidth) {
        document.body.classList.toggle(openClass);
    }
}

function handleWindowResize() {
    if (window.innerWidth > desktopWidth) {
        document.body.classList.remove(openClass);
    }
}


/*** MAIN ***/

if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', toggleMobileMenu);
    window.addEventListener('resize', handleWindowResize);
}
