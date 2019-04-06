document.addEventListener('DOMContentLoaded', () => {
    const triggers = document.querySelectorAll('.collapsible__trigger');
    triggers.forEach(trigger => {
        trigger.addEventListener('click', toggleCollapsible);
    });
});


function toggleCollapsible(e) {
    e.preventDefault();

    const trigger = e.currentTarget;
    const contentId = trigger.dataset.collapsible;
    const content = document.getElementById(contentId);

    // toggle content collapse
    if (content.style.maxHeight === '') {
        content.style.maxHeight = `${content.scrollHeight}px`;
        content.style.transitionDuration = `${content.scrollHeight * 0.8}ms`; 
    } else {
        content.style.maxHeight = '';
        content.style.transitionDuration = '';
    }

    // toggle trigger text
    const triggerText = trigger.querySelector('.elementor-button-text');
    if (triggerText.textContent === 'Mehr zeigen...') {
        triggerText.textContent = 'Weniger zeigen.';
    } else {
        triggerText.textContent = 'Mehr zeigen...';
    }
}
