(function() {
    /**
     * Input default values
     */
    function setDefaultInputValues(form) {
        const urlParams = new URLSearchParams(window.location.search);
        for(var pair of urlParams.entries()) {
            const name = pair[0];
            const value = pair[1];
            
            if (value) {
                const input = form.querySelector(`[name="${name}"]`);
                if (input) {
                    input.value = value;
                    input.classList.add('has-value');
                }
            }
        }
    }


    /**
     * Input change handler
     */
    function inputChangeHandler(e) {
        const input = e.target;
        const form = e.currentTarget;

        // add or remove has-value class 
        input.classList.toggle('has-value', input.value !== '');
        
        // disable form and event lists
        form.classList.add('disabled');
        document.querySelectorAll('.event-list').forEach(
            eventsList => eventsList.classList.add('disabled')
        );
        
        // submit form and reload page
        form.submit();
    }


    /**
     * MAIN
     */
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('events-filter');
        if (form) {
            setDefaultInputValues(form)
            form.addEventListener('change', inputChangeHandler);
        }
    });    
})()
