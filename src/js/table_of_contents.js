const uuid4 = require('uuid/v4');

/**
 * Generate table of contents (toc) from headings (without h1)
 */
document.addEventListener('DOMContentLoaded', () => {

    const tocContainer = document.querySelector('.toc-container'); 
    const tocContent = document.querySelector('.toc-content');
     
     if (tocContainer && tocContent) {
         const headings = tocContent.querySelectorAll('h2, h3, h4, h5, h6');
         headings.forEach(heading => {
             // generate random id
            const id = uuid4();

            // assign id to heading
            heading.id = id;
            
            // create table-of-contents entry
            const entry = document.createElement('a');
            entry.classList.add('toc-entry');
            entry.classList.add('toc-entry--' + heading.tagName.toLowerCase());
            entry.textContent = heading.textContent;
            entry.href = '#' + id;
            tocContainer.appendChild(entry);
         });
     }

});
