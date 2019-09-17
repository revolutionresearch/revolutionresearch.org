document.addEventListener('DOMContentLoaded', () => {

    const waForms = document.querySelectorAll('.wa__form');
    waForms.forEach(waForm => {
        waForm.addEventListener('submit', submitHandler);
    });

    function closeOutput(output, input) {
        output.innerHTML = '';
        input.focus();
    }
    
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

            // fetch result from wolfram alpha
            fetch(PHP_VARS.AJAX_URL, {
                // credentials: 'same-origin',
                credentials: 'include', // ms edge fix
                headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }),
                method: 'POST',
                body: `action=simple_wa_api_request&query=${query}`, // action = name of the php function
            })
            .then(res => res.text())
            .then(str => {
                // remove invalid '1' at the end of the string
                const cleanString = str.slice(0, -1);
                
                // create dom tree from string
                const parser = new window.DOMParser();
                const xmlDocument = parser.parseFromString(cleanString, "text/xml");
                return xmlDocument;
            })
            .then(xmlDocument => {
                
                form.classList.remove('wa__form--loading');
                input.disabled = false;
                button.disabled = false;

                const pods = xmlDocument.querySelectorAll('pod');

                // create close button
                if (pods.length) {
                    const closeButton = document.createElement('button');
                    closeButton.className = 'wa__close-button';
                    closeButton.setAttribute('type', 'button');
                    closeButton.innerHTML = '<i class="fa fa-close"></i>';
                    closeButton.addEventListener('click', () => closeOutput(output, input));
                    output.appendChild(closeButton);
                }

                pods.forEach(pod => {
                    const podEl = document.createElement('div');
                    podEl.className = 'wa__pod';
                    
                    // title
                    const titleEl = document.createElement('h3');
                    titleEl.className = 'wa__pod-title';
                    titleEl.textContent = `${pod.getAttribute('title')}:`;
                    podEl.appendChild(titleEl); 

                    // image
                    const images = pod.querySelectorAll('img');
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

