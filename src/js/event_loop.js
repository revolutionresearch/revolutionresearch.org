document.addEventListener('DOMContentLoaded', () => {

    const overview = document.querySelectorAll('.event-loop__overview');

    overview.forEach(overview => {
        overview.addEventListener('click', toggleEventDetails);
    });

});


/**
 * Toggle open state for clicked overview and
 * corresponding details with the same post id
 * 
 * @param {object} event click event
 */
function toggleEventDetails(e) {
    const target = e.target;
    const currentTarget = e.currentTarget || e.srcElement ;

    if (
        target.closest('.event-loop__button') ||
        document.body.classList.contains('.elementor-editor.active')
    ) {
       return; 
    }


    /* TOGGLE OVERVIEW */

    const openOverviewClass = 'event-loop__overview--open';
    const currentOverviewIsOpen = currentTarget.classList.contains(openOverviewClass);

    // remove open class from all overviews
    const openOverview = document.querySelectorAll(`.${openOverviewClass}`);
    openOverview.forEach(el => {
        el.classList.remove(openOverviewClass);
    });

    // add open class to current title
    if (!currentOverviewIsOpen) {
        currentTarget.classList.add(openOverviewClass);
    }


    /* TOGGLE DETAILS */

    // find details
    const id = currentTarget.dataset.post_id;
    const currentDetails = document.getElementById(`event-loop__details-${id}`);

    const openDetailsClass = 'event-loop__details--open';
    const currentDetailsIsOpen = currentDetails.classList.contains(openDetailsClass);
    
    // close all details
    const openDetails = document.querySelectorAll(`.${openDetailsClass}`);
    openDetails.forEach(el => {
        el.classList.remove(openDetailsClass);
        el.style.maxHeight = '';
        el.style.transitionDuration = '';
    });

    // open current details
    if (!currentDetailsIsOpen) {
        currentDetails.classList.add(openDetailsClass);
        const height = currentDetails.scrollHeight;
        currentDetails.style.maxHeight = `${height}px`
        currentDetails.style.transitionDuration = `${height * 0.8}ms`;
    }
}