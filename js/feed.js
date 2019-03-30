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
        this.postId = post.postId;
        this.type = post.type;
        this.createdAt = post.createdAt;
        this.content = post.content;
        this.mediaUrl = post.mediaUrl;
        this.mediaType = post.mediaType;
        this.author = post.author;
        this.title = post.title;
        this.postUrl = post.postUrl;
        this.profileImageUrl = post.profileImageUrl;
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
        const sortedItems = this.items.sort((a, b) => parseInt(b.dataset.rating, 10) - parseInt(a.dataset.rating, 10));
        this.colcade.append(sortedItems);
        console.log(sortedItems.map(i => i.dataset.rating));
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
            const itemElement = await this.createItem(itemData, index);
            this.items.push(itemElement);
            return itemElement;
        });
        
        // add items to feed
        Promise.all(items).then(items =>
            this.colcade.append(items)
        );
    }

    generatePostLink(postData) {
        switch (postData.type) {
            case 'tweet':
                return `https://twitter.com/${postData.screen_name}/status/${postData.attachments.tweet.tweet_id_str}`;
            case 'facebook_post':
                return `https://www.facebook.com/${postData.attachments.facebook_post.post_id_str}`;
            case 'article':
                return postData.url;
            default:
                return '#';
        }
    }

    async twitterHTML(twitterData, postData) {
        const { screen_name, tweet_id_str, profile_image_url, created_at, text, name, media_url} = twitterData;
        const post_link = this.generatePostLink(postData);
        const date_formatted = formatDateTime(created_at);

        let content = text;

        if (text.startsWith('Twitter http')) {
            const link = text.split('Twitter ')[1];
            content = `Twitter: <a href="${link}" target="_blank">${link}</a>`;
        }

        return `
            <h3 class="feedItem__title">
                <a href="${post_link}" target="_blank">
                    Tweet von ${name} (@${screen_name})
                </a>
            </h3>
            <div class="feedItem__meta">
                <div class="feedItem__profileImage" style="background-image: url('${profile_image_url}')"></div>
                <div class="feedItem__date">${date_formatted}</div>
            </div>
            ${media_url ? `
                <a class="feedItem__imageLink" href="${post_link}" target="_blank">
                    <img class="feedItem__image" src="${media_url}" />
                </a>
            ` : ''}
            <p class="feedItem__content">${content}</p>
            `;
        }
        
        facebookHTML(facebookData, postData) {
            const { post_id_str, from_id_str, message, from_name, created_time, picture, link, post_type} = facebookData;
            const post_link = this.generatePostLink(postData);
            const profile_image_url = `https://graph.facebook.com/${from_id_str}/picture?type=square`;
            const date_formatted = formatDateTime(created_time);

            const picture_link = link;
            
            return `
            <h3 class="feedItem__title">
                <a href="${post_link}" target="_blank">
                    Facebook-Post von ${from_name}
                </a>
            </h3>
            <div class="feedItem__meta">
                <div class="feedItem__profileImage" style="background-image: url('${profile_image_url}')"></div>
                <div class="feedItem__date">${date_formatted}</div>
            </div>
            ${picture ? `
                <a class="feedItem__imageLink feedItem__imageLink--${post_type}" href="${picture_link}" target="_blank">    
                    <img class="feedItem__image" src="${picture}" />
                </a>
            ` : ''}
            <p class="feedItem__content">${message}</p>
        `;
    }

    flocklerArticleHTML(data) {
        const { title, body, author, published_at, url } = data;
        const date_formatted = formatDateTime(published_at);

        return `
            <h3 class="feedItem__title">
                <a href="${url}" target="_blank">
                    ${title}
                </a>
            </h3>
            <div class="feedItem__meta">
                <div style="margin-right: 1rem;">${author}</div>
                <div class="feedItem__date">${date_formatted}</div>
            </div>
            <di class="feedItem__content">${body}</div>
        `;
    }

    async generateItemContent(itemData) {
        switch (itemData.type) {
            case 'tweet':
                return await this.twitterHTML(itemData.attachments.tweet, itemData);
            case 'facebook_post':
                return await this.facebookHTML(itemData.attachments.facebook_post, itemData);
            case 'article':
                return await this.flocklerArticleHTML(itemData);
            default:
                return itemData.type;
        }
    }

    calcRatingValue(ratingString) {
        if (ratingString === null || ratingString === '') {
            return { ratingValue: 0, ratingCount: 0 };
        }

        const ratings = ratingString.split(';');
        const ratingValue = ratings.reduce((acc, curr) => (
            acc + parseInt(curr, 10)
        ), 0);

        return {
            ratingValue,
            ratingCount: ratings.length // .split() returns always at least 1
        };
    }

    generateRatingValue(ratingString) {
        const { ratingValue, ratingCount } = this.calcRatingValue(ratingString);

        return `${ratingCount} Bewertung${ratingCount !== 1 ? 'en' : ''}: ${ratingValue || 0}`;
    }

    generateRatingWidget(ratingString, post_id) {
        const ratingValue = this.generateRatingValue(ratingString);
        return `
            <div class="rating">
                <label for="${post_id}" class="rating__label">
                    Wie sinnvoll findest Du diesen Beitrag?
                </label>
                <div class="rating__wrapper">
                    <span class="rating__emoji">😒</span>
                    <input class="rating__input" value="0" id="${post_id}" data-id="${post_id}" type="range" min="-4" max="4" step="1" />
                    <span class="rating__emoji">😊</span>
                </div>
                <div class="rating__value">
                    ${ratingValue}
                </div>
            </div>
        `;
    }

    generateShareWidget(data) {
        const link = this.generatePostLink(data);
        return `
            <div class="feedItem__sharing">
                <a href="https://www.facebook.com/sharer/sharer.php?u=${link}" title="Auf Facebook teilen!" target="_blank" rel="noopener noreferrer"><i class="fa fa-facebook"></i></a>
                <a href="https://twitter.com/home?status=${link}" title="Auf Twitter teilen!" target="_blank" rel="noopener noreferrer"><i class="fa fa-twitter"></i></a>
            </div>
        `;
        // <a href="https://wa.me/?text=Auf%20Gaddit.de%20findest%20Du%20die%20besten%20Amazon%20Deals%20und%20Rabatte%3A%20https%3A//gaddit.de/" title="Auf WhatsApp teilen!" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        // <a href="mailto:?&subject=Hier findest Du die besten Deals auf Amazon - Gaddit! Clever kaufen bei Amazon&body=Auf%20Gaddit.de%20findest%20Du%20die%20besten%20Amazon%20Deals%20und%20Rabatte%3A%20https%3A//gaddit.de/" title="Per E-Mail teilen!" target="_blank" rel="noopener noreferrer">E-Mail</a>
        // <a href="http://www.reddit.com/submit?url=https://gaddit.de/&title=Auf%20Gaddit.de%20findest%20Du%20die%20besten%20Amazon%20Deals%20und%20Rabatte!" title="Auf Reddit teilen!" target="_blank" rel="noopener noreferrer">Reddit</a>
        // <a href="https://telegram.me/share/url?url=https://gaddit.de&text=Auf%20Gaddit.de%20findest%20Du%20die%20besten%20Amazon%20Deals%20und%20Rabatte!" title="Auf Telegram teilen!" target="_blank" rel="noopener noreferrer">Telegram</a>
    }

    async createItem(itemData, index) {
        const { rating, id, post_id } = itemData;

        const itemElement = document.createElement('div');
        itemElement.className = 'feedItem';
        itemElement.style.animationDelay = `${index * 50}ms`
        itemElement.dataset.rating = this.calcRatingValue(rating).ratingValue;
        
        const content = await this.generateItemContent(itemData);
        const ratingWidget = this.generateRatingWidget(rating, post_id);
        const shareWidget = this.generateShareWidget(itemData);

        itemElement.innerHTML = `
            ${content}
            ${ratingWidget}
            ${shareWidget}
        `;

        return itemElement;
    }

    async updateItems() {
        if (!this.isFetching && this.page < 10) {
            const triggerItem = this.items[this.items.length - 11]; // tenth last items
            if (triggerItem && triggerItem.getBoundingClientRect().top <= window.innerHeight) {
                const items = await this.fetchItems();
                this.renderItems(items);
            }
        }
    }

    async updateRating({ target }) {
        if (target.classList.contains('rating__input')) {
            // read post id and rating value from dom
            const id = parseInt(target.dataset.id);
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
                target.parentNode.parentNode.querySelector('.rating__value')
                      .innerHTML = this.generateRatingValue(newRatingString);

                target.parentNode.parentNode.parentNode.dataset.rating = this.calcRatingValue(newRatingString).ratingValue;
            }
        }
    }
}

new Feed('#feed');
