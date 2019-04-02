/*
    Pseudo imports for reference
    import { randomIntFromInterval, formatDateTime } from './utils.js';
*/

/*
    Tested masonry plugins:
    - masonry.js: does not always work and has often overlapping issues
    - brick.js: some errors (?)
    - salvattore: columns are not well recalculated and have often very different heights
    - macy.js: some overlapping issues with image content
    - colcade.js: needs column placeholders but seems to work fine
*/

const apiUrl = 'http://projekt-zukunft.hhc-duesseldorf.de/wp-json/zukunft/v1';


class Post {
    constructor(post) {
        this.post = post;
        this.postId = this.post.post_id;
        this.type = this.post.post_type;
        this.title = this.post.post_title;
        this.ratingValue = this.post.rating.value;
        this.ratingCount = this.post.rating.count;

        this.timeCreated = '';
        this.timeCreatedFormatted = '';
        this.text = '';
        this.mediaUrl = '';
        this.mediaType = '';
        this.mediaSourceUrl = '';
        this.author = '';
        this.postUrl = '';
        this.profileImageUrl = '';

        this.normalizePostData();
    }

    normalizePostData() {
        const flockler = this.post.flockler;
        switch (flockler.type) {
            case 'tweet': {
                const { tweet } = flockler.attachments;
    
                if (tweet.text.startsWith('Twitter http')) {
                    const sharedLink = tweet.text.split('Twitter ')[1];
                    this.text = `Twitter: <a href="${sharedLink}" target="_blank">${sharedLink}</a>`;
                } else {
                    this.text = tweet.text;
                }
                
                this.timeCreated = new Date(tweet.created_at);
                this.timeCreatedFormatted = formatDateTime(tweet.created_at);
                this.mediaUrl = tweet.media_url;
                this.mediaType = 'image';
                this.mediaSourceUrl = this.postUrl;
                this.author = `${tweet.name} (@${tweet.screen_name})`;
                this.postUrl = `https://twitter.com/${this.post.screen_name}/status/${tweet.tweet_id_str}`;
                this.profileImageUrl = tweet.profile_image_url;
                break;
            }

            case 'facebook_post': {
                const { facebook_post } = flockler.attachments;

                this.timeCreated = new Date(facebook_post.created_time);
                this.timeCreatedFormatted = formatDateTime(facebook_post.created_time);
                this.text = facebook_post.message;
                this.author = facebook_post.from_name;
                this.mediaUrl = facebook_post.picture;
                this.mediaSourceUrl = facebook_post.link;
                this.mediaType = facebook_post.post_type;
                this.postUrl = `https://www.facebook.com/${facebook_post.post_id_str}`;
                this.profileImageUrl = `https://graph.facebook.com/${facebook_post.from_id_str}/picture?type=square`;
                break;
            }

            case 'article': {
                const article = flockler;
                this.timeCreated = new Date(article.published_at);
                this.timeCreatedFormatted = formatDateTime(article.published_at);
                this.text = article.body;
                this.author = article.author;
                this.postUrl = article.url;
                break;
            }

            default:
                break;
        }
    }

    createElement(index = 0) {
        this.element = document.createElement('div');

        this.element.className = `feedItem feedItem--flockler feedItem--${this.type}`;
        this.element.style.animationDelay = `${index * 50}ms`
        this.element.dataset.rating = this.ratingValue;
        this.element.innerHTML = this.generateHtml();

        return this.element;
    }

    generateHtml() {
        return `
            <div class="feedItem__debugInfos">
                Rating: <span class="rating-value">${this.ratingValue}</span>,
                Count: <span class="rating-count">${this.ratingCount}</span>,
                Created: ${this.timeCreatedFormatted}
            </div>
            <h3 class="feedItem__title">
                <a href="${this.postUrl}" target="_blank">
                    ${this.title}
                </a>
            </h3>
            
            <div class="feedItem__meta">
                <div class="feedItem__profileImage" style="background-image: url('${this.profileImageUrl}')"></div>
                <div class="feedItem__date">${this.timeCreatedFormatted}</div>
            </div>

            ${this.mediaUrl ? `
                <a class="feedItem__imageLink feedItem__imageLink--${this.mediaType}" href="${this.mediaSourceUrl}" target="_blank">    
                    <img class="feedItem__image" src="${this.mediaUrl}" />
                </a>
            ` : ''}

            <div class="feedItem__content">${this.text}</div>

            <div class="rating">
                <label for="${this.postId}" class="rating__label">
                    Wie sinnvoll findest Du diesen Beitrag?
                </label>
                <div class="rating__wrapper">
                    <span class="rating__emoji">😒</span>
                    <input class="rating__input" value="0" id="${this.postId}" data-id="${this.postId}" type="range" min="-4" max="4" step="1" />
                    <span class="rating__emoji">😊</span>
                </div>
            </div>
        
            <div class="feedItem__sharing">
                <a href="https://www.facebook.com/sharer/sharer.php?u=${this.postUrl}" title="Auf Facebook teilen!" target="_blank" rel="noopener noreferrer">
                    <i class="fa fa-facebook"></i>
                </a>
                <a href="https://twitter.com/home?status=${this.postUrl}" title="Auf Twitter teilen!" target="_blank" rel="noopener noreferrer">
                    <i class="fa fa-twitter"></i>
                </a>
            </div>
        `;
    } 

    updateRating(ratingString) {
        const ratings = ratingString.split(';');
        this.ratingValue = ratings.reduce((acc, r) => acc + parseInt(r, 10), 0);
        this.ratingCount = ratings.length;

        this.element.dataset.rating = this.ratingValue;
        this.element.querySelector('.feedItem__debugInfos .rating-value').innerText = this.ratingValue;
        this.element.querySelector('.feedItem__debugInfos .rating-count').innerText = this.ratingCount;
    }
}


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
        if (!isNaN(page)) {
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

    async reloadPage({ target }) {       
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
        const results = await fetch(`${apiUrl}/social-wall?page=${this.page}`);
        const json = await results.json();

        // const json = socialWallTestData[this.page];
        this.isFetching = false;

        return json;
    }

    async renderItems(data) {
        console.log('render items', data);
        // create items
        data.forEach((itemData, index) => {
            switch (itemData.post_type) {
                case 'post': {
                    const categories = itemData.categories.map(cat => cat.slug)
                    if (categories.includes('featured')) {
                        const featureElement = this.createFeatureElement(itemData);
                        this.colcade.append(featureElement);
                    } else if (categories.includes('frage')) {
                        const questionElement = this.createQuestionElement(itemData);
                        this.colcade.append(questionElement);
                    }
                    break;
                }
               
                case 'flockler_post': {
                    const item = new Post(itemData);
                    this.items.push(item);

                    const itemElement = item.createElement(index);
                    this.itemsElements.push(itemElement);

                    this.colcade.append(itemElement);
                    break;
                }
                
                default:
                    break;
            }

            // you
            if (index % 10 === 0) {
                const youTile = this.youTile();
                this.colcade.append(youTile);
                this.youIndex += 1;
            }
        });
    }

    youTile() {
        const element = document.createElement('div');
        element.className = 'feedItem feedItem--you';
        element.id = `you-${this.youIndex}`;
        element.innerHTML = `
            <h3>Was denkst DU?</h3>
            <textarea></textarea>
            <button onclick="document.querySelector('#you-${this.youIndex} textarea').value = '';">Senden</button>
        `;
        return element;
    }

    createQuestionElement(questionPostData) {
        const element = document.createElement('div');
        element.className = 'feedItem feedItem--question';
        element.innerHTML = `
            <h3>${questionPostData.post_title}</h3>
        `;
        return element;
    }

    createFeatureElement(featurePostData) {
        const element = document.createElement('div');
        element.className = 'feedItem feedItem--feature';
        element.innerHTML = `
            <h3>${featurePostData.post_title}</h3>
        `;
        return element;
    }

    async updateRating({ target }) {
        if (target.classList.contains('rating__input')) {
            // read post id and rating value from dom
            const id = parseInt(target.dataset.id, 10);
            const value = parseInt(target.value, 10);
            
            // validate rating value
            if (value !== 0 && value >= -4 && value <= 4) {
                // post request
                const res = await fetch(`${apiUrl}/flockler/${id}/rating`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },    
                    method: 'POST',
                    body: JSON.stringify({ value })
                });
                const newRatingString = await res.json();

                // update dom
                target.disabled = true;
                target.parentNode.style.display = 'none';
                target.parentNode.previousElementSibling.style.display = 'none';
                const feedItem = target.closest('.feedItem');
                const itemIndex = this.itemsElements.indexOf(feedItem);
                this.items[itemIndex].updateRating(newRatingString);
            }
        }
    }
}

new Feed('#feed', {
    reloadButton: '#feed-reload-button',
    paginationsSelector: '.feed-pagination'
});
