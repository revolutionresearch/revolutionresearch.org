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
        this.type = this.post.type;
        this.title = this.post.title;
        this.ratings = this.getRatings(this.post.rating);
        this.ratingValue = this.calcRatingValue();
        this.ratingText = this.generateRatingText();

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
        switch (this.post.type) {
            case 'tweet': {
                const { tweet } = this.post.attachments;

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
                const { facebook_post } = this.post.attachments;

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
                this.timeCreated = new Date(this.post.published_at);
                this.timeCreatedFormatted = formatDateTime(this.post.published_at);
                this.text = this.post.body;
                this.author = this.post.author;
                this.postUrl = this.post.url;
                break;
            }

            default:
                break;
        }
    }

    createElement(index = 0) {
        this.element = document.createElement('div');

        this.element.className = 'feedItem';
        this.element.style.animationDelay = `${index * 50}ms`
        this.element.dataset.rating = this.ratingValue;
        this.element.innerHTML = this.generateHtml();

        return this.element;
    }

    generateHtml() {
        return `
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
                <div class="rating__text">
                    ${this.ratingText}
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

    getRatings(ratingsString) {
        if (ratingsString === null || ratingsString === '') {
            return [];
        }
        return ratingsString.split(';');
    }

    calcRatingValue() {
        return this.ratings.reduce((acc, curr) => (
            acc + parseInt(curr, 10)
        ), 0);
    }

    generateRatingText() {
        return `${this.ratings.length} Bewertung${this.ratings.length !== 1 ? 'en' : ''}: ${this.ratingValue || 0}`;
    }   

    updateRating(ratingString) {
        this.ratings = this.getRatings(ratingString);
        this.ratingValue = this.calcRatingValue();
        this.ratingText = this.generateRatingText();

        this.element.dataset.rating = this.ratingValue;
        this.element.querySelector('.rating__text').innerHTML = this.ratingText;
    }
}


/**
 * FEED CLASS
 */
class Feed {
    constructor(rootSelector) {
        this.rootSelector = rootSelector;
        this.root = document.querySelector(this.rootSelector);

        // dynamic propteries
        this.page = 0;
        this.hasMoreItems = true;
        this.isFetching = false;
        this.items = [];
        this.itemsElements = [];

        // binding
        this.updateItems = this.updateItems.bind(this);
        this.updateRating = this.updateRating.bind(this);
        this.testReordering = this.testReordering.bind(this);

        // INIT
        if (this.root) {
            this.init();
        }
    }

   async  init() {
       // event listeners
        document.addEventListener('scroll', this.updateItems);
        this.root.addEventListener('change', this.updateRating);
        this.root.addEventListener('click', this.testReordering);

        // init masonry layout with Colcade
        this.colcade = new Colcade(this.root, {
            columns: '.grid-col',
            items: '.feedItem'
        });

        // fetch and render first items
        const items = await this.fetchItems();
        this.renderItems(items);
    }

    testReordering({ target }) {
        if (target.id !== 'feed') {
            return;
        }
        
        // remove all children
        const oldItems = this.root.querySelectorAll('.feedItem');
        for (let i = 0; i < oldItems.length; i++) {
            oldItems[i].remove();
        }
        const sortedItems = this.itemsElements.sort((a, b) => parseInt(b.dataset.rating, 10) - parseInt(a.dataset.rating, 10));
        this.colcade.append(sortedItems);
    }

    async fetchItems() {
        this.isFetching = true;

        const results = await fetch(`${apiUrl}/flockler?page=${this.page}`);
        const json = await results.json();
        
        this.page += 1;
        this.isFetching = false;

        return json;
    }

    async renderItems(data) {
        // create items
        const items = data.map(async (itemData, index) => {
            const item = new Post(itemData);
            this.items.push(item);
            
            const itemElement = item.createElement(index);
            this.itemsElements.push(itemElement);
            
            return itemElement;
        });
        
        // add items to feed
        Promise.all(items).then(items =>
            this.colcade.append(items)
        );
    }

    async updateItems() {
        if (!this.isFetching && this.page < 10) {
            const triggerItem = this.itemsElements[this.items.length - 11]; // tenth last items
            if (triggerItem && triggerItem.getBoundingClientRect().top <= window.innerHeight) {
                const items = await this.fetchItems();
                this.renderItems(items);
            }
        }
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
                const feedItem = target.closest('.feedItem');
                const itemIndex = this.itemsElements.indexOf(feedItem);
                this.items[itemIndex].updateRating(newRatingString)
            }
        }
    }
}

new Feed('#feed');
