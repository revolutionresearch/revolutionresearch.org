/**
 * source: https://www.w3schools.com/howto/howto_js_fullscreen.asp
 * documentation: https://developer.mozilla.org/de/docs/Web/API/Vollbild_API
 */
document.addEventListener('DOMContentLoaded', () => {

    function openFullscreen(e) {
        e.preventDefault();

        const page = document.documentElement;
        if (page.requestFullscreen) {
            page.requestFullscreen();
        } else if (page.mozRequestFullScreen) { // Firefox
            page.mozRequestFullScreen();
        } else if (page.webkitRequestFullscreen) { // Chrome, Safari, Opera
            page.webkitRequestFullscreen();
        } else if (page.msRequestFullscreen) { // IE/Edge
            page.msRequestFullscreen();
        }
    }

    function closeFullscreen(e) {
        e.preventDefault();

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }

    function fullscreenEnabled() {
        if (typeof document.fullscreen !== 'undefined') {
            return document.fullscreen;
        } else if (typeof document.webkitIsFullScreen !== 'undefined') { // Chrome, Safari, Opera, Edge
            return document.webkitIsFullScreen;
        } else if (typeof document.mozFullScreen !== 'undefined') { // Firefox
            return document.mozFullScreen;
        }
    }

    function toggleFullscreen(e) {
        if (fullscreenEnabled()) {
            closeFullscreen(e);
        } else {
            openFullscreen(e);
        }
    }

    // some delay ro make sure, the fullscreen notice popup is created
    setTimeout(() => {

        // add open fullscreen event
        document.querySelectorAll('.open-fullscreen').forEach(element => {
            element.addEventListener('click', openFullscreen);
        });

        // add close fullscreen event
        document.querySelectorAll('.close-fullscreen').forEach(element => {
            element.addEventListener('click', closeFullscreen);
        });

        // add toggle fullscreen event
        document.querySelectorAll('.toggle-fullscreen').forEach(element => {
            element.addEventListener('click', toggleFullscreen);
        });

    }, 500);
});