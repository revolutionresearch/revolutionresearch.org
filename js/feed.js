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
        switch (this.post.post_type) {
            case 'post': {
                const categories = this.post.categories.map(cat => cat.slug)
                if (categories.includes('featured')) {
                    console.log('featured post', this.post);
                } else if (categories.includes('frage')) {
                    console.log('fragen post', this.post);
                }
                break;
            }
            case 'flockler_post': {
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
            <div class="feedItem__debugInfos">
                Rating: ${this.ratingValue},
                Count: ${this.ratingCount},
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
                <div class="rating__text">
                    ${this.generateRatingText()}
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

    generateRatingText() {
        return `${this.ratingCount} Bewertung${this.ratingsCount !== 1 ? 'en' : ''}: ${this.ratingValue || 0}`;
    }   

    updateRating({ value, count }) {
        this.ratingValue = value;
        this.ratingCount = count;

        this.element.dataset.rating = this.ratingValue;
        this.element.querySelector('.rating__text').innerHTML = this.generateRatingText();
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
        this.questions = [];
        this.questionIndex = 0;
        this.youIndex = 0;

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
        // this.root.addEventListener('click', this.testReordering);

        // init masonry layout with Colcade
        this.colcade = new Colcade(this.root, {
            columns: '.grid-col',
            items: '.feedItem'
        });

        // fetch and render first items
        const firstItems = await this.fetchItems();
        this.renderItems(firstItems);
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
        const results = await fetch(`${apiUrl}/social-wall?page=${this.page}`);
        const json = await results.json();

        this.page += 1;
        this.isFetching = false;

        return json;
    }

    async renderItems(data) {
        console.log('render items', data);
        // create items
        data.forEach((itemData, index) => {
            const item = new Post(itemData);
            this.items.push(item);
            
            const itemElement = item.createElement(index);
            this.itemsElements.push(itemElement);

            this.colcade.append(itemElement);

            // you
            if (index % 10 === 0) {
                const youTile = this.youTile();
                this.colcade.append(youTile);
                this.youIndex += 1;
                // this.itemsElements.push(youTile);
            }

            // question
            if (index % 15 === 0 && this.questionIndex < this.questions.length) {
                const questionTile = this.questionTile();
                this.colcade.append(questionTile);
                // this.itemsElements.push(questionTile);
                this.questionIndex += 1;
            }
            
            // return itemElement;
        });
        
        // add items to feed
        // Promise.all(items).then(items => {
        //     this.colcade.append(items);
        //     this.colcade.append(this.youTile());
        // });
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

    questionTile() {
        const question = this.questions[this.questionIndex];
        const element = document.createElement('div');
        element.className = 'feedItem feedItem--question';
        element.innerHTML = `
            <h3>${question.post_title}</h3>
        `;
        return element;
    }

    async updateItems() {
        if (!this.isFetching && this.page < 4) {
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
                target.disabled = true;
                target.parentNode.style.display = 'none';
                target.parentNode.previousElementSibling.style.display = 'none';
                const feedItem = target.closest('.feedItem');
                const itemIndex = this.itemsElements.indexOf(feedItem);
                this.items[itemIndex].updateRating(newRatingString)
            }
        }
    }
}

new Feed('#feed');
