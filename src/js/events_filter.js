document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('events-filter');

    if (form) {
        // add default values from url params
        const urlParams = new URLSearchParams(window.location.search);
        for(var pair of urlParams.entries()) {
            const name = pair[0];
            const value = pair[1];
            
            if (value) {
                const input = form.querySelector(`[name="${name}"]`);
                if (input) {
                    input.value = value;
                }
            }
        }



        // submit after change
        form.addEventListener('change', () => {
            document.querySelectorAll('.event-list').forEach(
                eventsList => eventsList.classList.add('disabled')
            );
            form.classList.add('disabled');
            form.submit();
        });
    }
});
