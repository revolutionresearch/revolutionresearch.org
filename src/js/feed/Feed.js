const Colcade = require('colcade');

const ActPost = require('./ActPost');
const FlocklerPost = require('./FlocklerPost');
const QuestionPost = require('./QuestionPost');
const UserSubmitForm = require('./UserSubmitForm');

/*
    Tested masonry plugins:
    - masonry.js: does not always work and has often overlapping issues
    - brick.js: some errors (?)
    - salvattore: columns are not well recalculated and have often very different heights
    - macy.js: some overlapping issues with image content
    - colcade.js: needs column placeholders but seems to work fine
*/


/**
 * FEED CLASS
 */
class Feed {
    constructor(rootSelector, options) {
        this.rootSelector = rootSelector;
        this.root = document.querySelector(this.rootSelector);
        
        if (options.reloadButton) {
            this.reloadButton = document.querySelector(options.reloadButton);
        }

        if (options.paginationsSelector) {
            this.paginationsSelector = options.paginationsSelector;
        }

        // dynamic propteries
        this.page = 0;
        this.hasMoreItems = true;
        this.isFetching = false;
        this.items = [];
        this.itemsElements = [];
        this.youIndex = 0;

        // binding
        this.reloadPage = this.reloadPage.bind(this);
        this.updateRating = this.updateRating.bind(this);
        
        // INIT
        if (this.root) {
            this.init();
        }
    }

   async  init() {
       // event listeners
       this.root.addEventListener('change', this.updateRating);

       if (this.reloadButton) {
           this.reloadButton.addEventListener('click', this.reloadPage);
        }

        // get page from url
        const urlParts = window.location.pathname.split('/');
        const page = urlParts[urlParts.length - 2];
        if (!isNaN(page) && page !== '') {
            this.page = parseInt(page, 10) - 1;
        }

        // set current pageination item
        const paginationItems = document.querySelectorAll(`${this.paginationsSelector} .elementor-icon-list-text`);
        paginationItems.forEach(paginationItem => {
            if (this.page === parseInt(paginationItem.textContent, 10) - 1) {
                paginationItem.classList.add('current');
            }
        });

        // init masonry layout with Colcade
        this.colcade = new Colcade(this.root, {
            columns: '.grid-col',
            items: '.feedItem'
        });

        // fetch and render first items
        const firstItems = await this.fetchItems();
        this.renderItems(firstItems);
    }

    async reloadPage() {       
        // fetch items
        const newItems = await this.fetchItems();
    
        // remove old items
        const oldItems = this.root.querySelectorAll('.feedItem');
        for (let i = 0; i < oldItems.length; i++) {
            oldItems[i].remove();
        }

        // render new items
        this.renderItems(newItems);
    }

    async fetchItems() {
        this.isFetching = true;
        const results = await fetch(
            `${PHP_VARS.API_URL}/social-wall?page=${this.page}`,
            { credentials: 'include' }
        );
        const json = await results.json();

        // const json = socialWallTestData[this.page];
        this.isFetching = false;

        return json;
    }

    async renderItems(data) {
        // create items
        console.log(data);
        data.forEach((itemData, index) => {
            switch (itemData.post_type) {
                case 'post': {
                    const categories = itemData.categories.map(cat => cat.slug)
                    if (categories.includes('act')) {
                        const item = new ActPost(itemData);
                        this.appendItem(item, index);
                    } else if (categories.includes('frage')) {
                        const item = new QuestionPost(itemData);
                        this.appendItem(item, index);
                    }
                    break;
                }
                case 'flockler_post': {
                    const item = new FlocklerPost(itemData);
                    this.appendItem(item, index);
                    break;
                }
                case 'user_submitted_posts_form': {
                    const item = new UserSubmitForm(itemData);
                    this.appendItem(item, index);
                }
                default:
                    break;
            }
        });
    }

    appendItem(item, index) {
        this.items.push(item);

        const itemElement = item.createElement(index);
        this.itemsElements.push(itemElement);

        this.colcade.append(itemElement);
    }

    async updateRating({ target }) {
        if (target.classList.contains('rating__input')) {
            // read post id and rating value from dom
            const id = parseInt(target.dataset.id, 10);
            const value = parseInt(target.value, 10);
            
            // validate rating value
            if (value !== 0 && value >= -4 && value <= 4) {
                // post request
                // const res = await fetch(`${PHP_VARS.API_URL}/flockler/${id}/rating`, {
                //     credentials: 'include',
                //     headers: {
                //         'Accept': 'application/json',
                //         'Content-Type': 'application/json'
                //     },    
                //     method: 'POST',
                //     body: JSON.stringify({ value })
                // });
                // const newRatingString = await res.json();


                // update dom
                // target.disabled = true;
                // target.parentNode.style.display = 'none';
                // target.parentNode.previousElementSibling.style.display = 'none';
                // const feedItem = target.closest('.feedItem');
                // const itemIndex = this.itemsElements.indexOf(feedItem);
                // this.items[itemIndex].updateRating(newRatingString);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Feed('#feed', {
        reloadButton: '#feed-reload-button',
        paginationsSelector: '.feed-pagination'
    });
});
