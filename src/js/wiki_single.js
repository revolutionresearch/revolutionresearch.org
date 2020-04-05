const uuid4 = require('uuid/v4');


document.addEventListener('DOMContentLoaded', () => {

    const PAGE_LENGTH = 1000; // number of characters including whitespace

    const wikiTOC = document.querySelector('.wiki-toc'); 
    const wikiContent = document.querySelector('.wiki-content');

    /**
     * Generate table of contents (toc) from headings (without h1)
     */
    function generateTOC () {
        const headings = wikiContent.querySelectorAll('h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            // generate random id
            const id = uuid4();

            // create target element with the id above the
            // heading to compensate for the nav menu
            const target = document.createElement('div');
            target.className = 'toc-target';
            target.id = id;
            heading.appendChild(target);
            
            // create table-of-contents entry
            const entry = document.createElement('a');
            entry.classList.add('toc-entry');
            entry.classList.add('toc-entry--' + heading.tagName.toLowerCase());
            entry.textContent = heading.textContent;
            entry.href = '#' + id;
            wikiTOC.appendChild(entry);
        });
    }

    /**
     * Divide Content in pages
     * make page break after paragraph, that exceeds the PAGE_LENGTH
     */
    function generatePages() {
        const pageElements = Array.from(wikiContent.querySelector('.elementor-widget-container').children);

        const pages = [];

        function addToCurrentPage(element) {
            if (pages.length > 0) {
                pages[pages.length - 1].push(element);
            } else {
                createNewPage(element);
            }
        }

        function createNewPage(element) {
            pages.push([element]);
        }

        console.log(pageElements);

        pageElements.forEach(element => {
            if (element.tagName === 'P') {
                const currentPageElements = pages[pages.length - 1]

                let currentPageLength = 0;
                currentPageElements.forEach(pageElement => {
                    console.log('pageElement:', pageElement.textContent.length, pageElement);    
                    currentPageLength += pageElement.textContent.length;
                });

                console.log('currentPageLength:', currentPageLength);
                if (currentPageLength >= PAGE_LENGTH) {
                    createNewPage(element);
                } else {
                    addToCurrentPage();
                }
            } else {
                addToCurrentPage(element);
            }
            element.dataset.page = pages.length -1;
        });

        console.log('pages:', pages);
    }

    if (wikiTOC && wikiContent) {
        generateTOC();
        generatePages();
    }
});
