document.addEventListener('DOMContentLoaded', () => {
    // setup trigger events
    const triggers = document.querySelectorAll('.collapsible__trigger');
    triggers.forEach(trigger => {
        trigger.addEventListener('click', toggleCollapsible);
    });

    // setup initial content transition speed
    const contents = document.querySelectorAll('.collapsible__content');
    contents.forEach(content => {
        content.style.transitionDuration = calcTransitionSpeed(content); 
    });
});

function calcTransitionSpeed(content) {
    return `${content.scrollHeight * 0.8}ms`;
}


function toggleCollapsible(e) {
    if (document.body.classList.contains('.elementor-editor.active')) {
        return;
    }

    e.preventDefault();

    const trigger = e.currentTarget || e.srcElement ;
    const contentId = trigger.dataset.collapsible;
    const content = document.getElementById(contentId);

    // toggle content collapse
    if (content.style.maxHeight === '') {
        content.style.maxHeight = `${content.scrollHeight}px`;
        content.style.transitionDuration = calcTransitionSpeed(content); 
    } else {
        content.style.maxHeight = '';
    }

    // toggle trigger text
    const triggerText = trigger.querySelector('.elementor-button-text');
    if (triggerText.textContent === 'Mehr zeigen...') {
        triggerText.textContent = 'Weniger zeigen.';
    } else {
        triggerText.textContent = 'Mehr zeigen...';
    }
}
