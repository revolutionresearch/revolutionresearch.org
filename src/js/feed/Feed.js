const Colcade = require('colcade');

const ActPost = require('./ActPost');
const FlocklerPost = require('./FlocklerPost');
const QuestionPost = require('./QuestionPost');
const UserSubmitForm = require('./UserSubmitForm');
const DuBeitrag = require('./DuBeitrag');

const { getUrlParameter } = require('../utils');

/*
    Tested masonry plugins:
    - masonry.js: does not always work and has often overlapping issues
    - brick.js: some errors (?)
    - salvattore: columns are not well recalculated and have often very different heights
    - macy.js: some overlapping issues with image content
    - colcade.js: needs column placeholders but seems to work fine (currently used)
*/


/**
 * FEED CLASS
 */
class Feed {
    constructor(rootSelector, options) {
        this.rootSelector = rootSelector;
        this.root = document.querySelector(this.rootSelector);

        if (!this.root) return;

        this.grid = this.root.querySelector('.grid');
        
        if (options.reloadButton) {
            this.reloadButton = document.querySelector(options.reloadButton);
        }

        if (options.paginationsSelector) {
            this.paginationsSelector = options.paginationsSelector;
        }

        // dynamic propteries
        this.page = parseInt(getUrlParameter('_page', 1)) - 1; // start with 0
        this.hasMoreItems = true;
        this.isFetching = false;
        this.items = [];
        this.itemsElements = [];
        this.youIndex = 0;

        // binding
        this.reloadPage = this.reloadPage.bind(this);
        
        // INIT
        this.init();
    }

   async  init() {
        // set loading
        this.root.classList.add('feed--loading');

        // event listeners
        if (this.reloadButton) {
           this.reloadButton.addEventListener('click', this.reloadPage);
        }

        // set current pageination item
        const paginationItems = document.querySelectorAll(`${this.paginationsSelector} .elementor-icon-list-text`);
        paginationItems.forEach(paginationItem => {
            if (this.page === parseInt(paginationItem.textContent, 10) - 1) {
                paginationItem.classList.add('current');
            }
        });

        // init masonry layout with Colcade
        this.colcade = new Colcade(this.grid, {
            columns: '.grid__col',
            items: '.feedItem'
        });

        // fetch and render first items
        const firstItems = await this.fetchItems();
        this.renderItems(firstItems);
    }

    async reloadPage(e) {
        e.preventDefault();

        // set loading
        this.root.classList.add('feed--loading');
  
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
        const parsed_json = JSON.parse(json);

        this.isFetching = false;

        return parsed_json.data;
    }

    async renderItems(data) {
        // create items
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
                    } else if (categories.includes('du-beitrag')) {
                        const item = new DuBeitrag(itemData);
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

        // unset loading
        this.root.classList.remove('feed--loading');
    }

    appendItem(item, index) {
        this.items.push(item);

        const itemElement = item.createElement(index);
        this.itemsElements.push(itemElement);

        this.colcade.append(itemElement);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Feed('#feed', {
        reloadButton: '#feed-reload-button',
        paginationsSelector: '.feed-pagination'
    });
});
