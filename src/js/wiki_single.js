const { isHeadingElement, getUrlParameter } = require('./utils');


document.addEventListener('DOMContentLoaded', () => {
    const MAX_PAGE_LENGTH = 3439; // number of characters including whitespace

    const wikiContent = document.getElementById('wiki-content');
    const wikiPagination = document.getElementById('wiki-pagination');
    const wikiTOC = document.getElementById('wiki-toc'); 

    if ( !wikiContent || !wikiPagination || !wikiTOC ) {
        // console.error('No element(s) with id #wiki-content, #wiki-pagination and/or #wiki-toc found!')
        return;
    }

    const pageElements = Array.from(wikiContent.querySelector('.elementor-widget-container').children);
    const pages = [];

    // Generate pages
    generatePages();

    // Display current page
    displayCurrentPage();

    // Generate pagination and table of contents
    wikiPagination && generatePaginagtion();
    wikiTOC && generateTOC();


    /**
     * Divide Content in pages
     * make page break after paragraph, that exceeds the MAX_PAGE_LENGTH
     */
    function generatePages() {
        let currentPageLength = 0;

        pageElements.forEach(element => {

            if (element.tagName === 'P') {
                // split paragraphs by wors
                const words = element.textContent.split(' ');
                let currentPageWords = [];
                let __currentPageLength = currentPageLength;

                words.forEach(word => {
                    if (__currentPageLength < MAX_PAGE_LENGTH) {
                        currentPageWords.push(word);
                        __currentPageLength += (word.length + 1); // word with 1 space
                    } else {
                        const newElement = element.cloneNode();
                        newElement.textContent = currentPageWords.join(' ');
                        addToCurrentPage(newElement);
                        createNewPage();

                        currentPageWords = [word];
                        __currentPageLength = (word.length + 1); // reset to 0 and add word with 1 space
                    } 
                });

                // last words on current page
                const newElement = element.cloneNode();
                newElement.textContent = currentPageWords.join(' ');
                addToCurrentPage(newElement);
                
            } else {
                // headings or other tags
                if (currentPageLength < MAX_PAGE_LENGTH) {
                    addToCurrentPage(element);
                } else {
                    createNewPage(element);
                }
            }
        });

        console.log('pages:', pages);

        function addToCurrentPage(element) {
            if (pages.length === 0) {
                createNewPage(element);
            } else {
                pages[pages.length - 1].push(element);
                element.dataset.page = pages.length -1;
                currentPageLength += element.textContent.length;
            }
        }
     
        function createNewPage(element = null) {
            if (element) {
                pages.push([element]);
                currentPageLength = element.textContent.length;
                element.dataset.page = pages.length -1;
            } else {
                pages.push([]);
                currentPageLength = 0;
            }
        }
    

        return;


        pageElements.forEach((element, index) => {

            // add element to current or next page
            if (currentPageLength >= MAX_PAGE_LENGTH) {
                // max page length reached -> new page
                createNewPage(element);
            } else {
                if ((currentPageLength + element.textContent.length) < MAX_PAGE_LENGTH) {
                    //  max page length not reached -> current page
                    addToCurrentPage(element);
                    
                    // save page as data-page attribute
                    element.dataset.page = pages.length -1;
                } else {
                    if (element.tagName === 'P') {
                        // max page length would have been reached with the new element.
                        // -> add part to current and part to next page
                        const words = element.textContent.split(' ');
    
                        let pageWords = [];
                        let __currentPageLength = currentPageLength;
                        
                        words.forEach(word => {
                            if (__currentPageLength < MAX_PAGE_LENGTH) {
                                pageWords.push(word);
                                __currentPageLength += (word.length + 1); // add 1 space for each word
                            } else {
                                element.textContent = pageWords.join(' ');
                                addToCurrentPage(element);

                                pageWords = [word]
                                __currentPageLength = word.length + 1; // reset to 0 and add 1 space for each word
                            }
                            console.log('length', __currentPageLength);
                        });

                        
                        
                        const newPageElement = document.createElement('p');
                        newPageElement.className = element.className;
                        newPageElement.textContent = newPageWords.join(' ');
                        createNewPage(newPageElement);

                        // save page as data-page attribute
                        element.dataset.page = pages.length -2;
                        newPageElement.dataset.page = pages.length -2;
                    } else {
                        addToCurrentPage(element);
                        // save page as data-page attribute
                        element.dataset.page = pages.length -1;
                    }
                }
            }
        });
    }


    function getPageIndex() {
        // let pageIndex = 0;

        // // search for page number in body class
        // for (let i = 0; i < pages.length; i++) {
        //     if (document.body.classList.contains(`paged-${i + 1}`)) {
        //         pageIndex = i;
        //         break;
        //     }       
        // }

        // return pageIndex;

        // get page number form url
        return parseInt(getUrlParameter('pageindex', 1)) - 1;

    }


    /**
     * Display a specific page
     * @param {int} pageIndex 
     */
    function displayCurrentPage() {
        const pageIndex = getPageIndex();

        // console.log('pageIndex:', pageIndex);

        // reset page content
        wikiContent.innerHTML = '';

        // fill page with elements for pageIndex
        pages[pageIndex].forEach(pageElement => {
            wikiContent.appendChild(pageElement);
        })
    }


    /**
     * Creates pagination items and sets the current one
     */
    function generatePaginagtion() {
        // console.log('pages.length', pages.length);
        if (pages.length <= 1) {
            const wikiPaginationSection = document.getElementById('wiki-pagination-section');
            if (wikiPaginationSection) {
                wikiPaginationSection.style.display = 'none';
            }
        } else {
            const list = wikiPagination.querySelector('.elementor-icon-list-items');
            const firstItem = list.querySelector('.elementor-icon-list-item');
            const currentPage = getPageIndex();
            
            for (let i = 1; i < pages.length; i++) {
                const page = i + 1;
                const item = firstItem.cloneNode(true);
                const itemLink = item.querySelector('a');
                const itemText = item.querySelector('.elementor-icon-list-text')
                
                // itemLink.href = `${itemLink.href}${page}/`;
                itemLink.href = `?pageindex=${page}`;
                itemText.textContent = page;

                list.appendChild(item);

                if (i === currentPage) {
                    itemText.classList.add('current');
                }
            }

            if (currentPage === 0) {
                firstItem.querySelector('.elementor-icon-list-text').classList.add('current');
            }
        }
    }


    /**
     * Generate table of contents (toc) from headings (without h1)
     * Warning: needs to run after page generation 
     */
    function generateTOC () {
        const headings = pageElements.filter(el => ['H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName));
        headings.forEach((heading, index) => {
            // generate random id
            const id = `toc${index}`;
            const page = parseInt(heading.dataset.page, 10) + 1;

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
            entry.href = `?pageindex=${page}/#${id}`;
            wikiTOC.appendChild(entry);
        });
    }
});
