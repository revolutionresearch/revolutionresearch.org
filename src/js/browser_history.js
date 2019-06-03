/**
 * Go back in browser history on a click on an element
 * with the class browser-hsitory-back 
 */
document.addEventListener('DOMContentLoaded', () => {

    function browserHistoryGoBack(e) {
        if (window.history.back) {
            e.preventDefault();
            window.history.back();
        }
    }

    document.querySelectorAll('.browser-history-back').forEach(element => {
        element.addEventListener('click', browserHistoryGoBack);
    });
});
