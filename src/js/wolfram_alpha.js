document.addEventListener('DOMContentLoaded', () => {

    const waForms = document.querySelectorAll('.wa__form');
    waForms.forEach(waForm => {
        waForm.addEventListener('submit', submitHandler);
    });
    
    function submitHandler(e) {
        e.preventDefault();

        const form = this;
        const input = form.querySelector('.wa__input');
        const button = form.querySelector('.wa__submit');
        const output = form.nextElementSibling;

        // reset output
        output.innerHTML = '';

        const query = input.value;

        if (query !== '') {
            form.classList.add('wa__form--loading');
            input.disabled = true;
            button.disabled = true;

            fetch(PHP_VARS.AJAX_URL, {
                credentials: 'same-origin',
                headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }),
                method: 'POST',
                body: `action=simple_wa_api_request&query=${query}`, // action = name of the php function
            })
            .then(res => res.text())
            .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
            .then(xmlDocument => {
                form.classList.remove('wa__form--loading');
                input.disabled = false;
                button.disabled = false;

                const pods = xmlDocument.querySelectorAll('pod');
                pods.forEach(pod => {
                    const podEl = document.createElement('div');
                    podEl.className = 'wa__pod';
                    
                    // title
                    const titleEl = document.createElement('h3');
                    titleEl.className = 'wa__pod-title';
                    titleEl.textContent = `${pod.getAttribute('title')}:`;
                    podEl.appendChild(titleEl); 

                    // image
                    const images= pod.querySelectorAll('img');
                    images.forEach(image => {
                        const subPodEl = document.createElement('div');
                        subPodEl.className = 'wa__sub-pod';
                        
                        const imgEl = document.createElement('img');
                        imgEl.src = image.getAttribute('src');
                        imgEl.alt = image.getAttribute('alt');
                        imgEl.width = image.getAttribute('width');
                        imgEl.height = image.getAttribute('height');
                        imgEl.title = image.getAttribute('title');
                        subPodEl.appendChild(imgEl);
                        
                        podEl.appendChild(subPodEl); 
                    });

                    output.appendChild(podEl);
                });
            });
        } else {
            input.focus();
        }
    }
})

