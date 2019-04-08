/*
    Pseudo imports for reference
    import { urlify } from '../utils.js';
*/

const featuredAuthorIds = [
    '603671170098955', // Projekt Zukunft Test (Facebook)
    '1104029858848489473' // TestZukunft (Twitter)
];

class FlocklerPost {
    constructor(post) {
        this.post = post;
        this.postId = this.post.post_id;
        this.type = this.post.post_type;
        this.title = this.post.post_title;
        this.ratingValue = this.post.rating.value || 0;
        this.ratingCount = this.post.rating.count || 0;

        this.timeCreated = '';
        this.timeCreatedFormatted = '';
        this.text = '';
        this.mediaUrl = '';
        this.mediaType = '';
        this.mediaSourceUrl = '';
        this.author = '';
        this.authorId = '';
        this.postUrl = '';
        this.profileImageUrl = '';

        this.normalizePostData();
    }

    normalizePostData() {
        const flockler = this.post.flockler;
        switch (flockler.type) {
            case 'tweet': {
                const { tweet } = flockler.attachments;
    
                this.text = tweet.text;
                this.timeCreated = new Date(tweet.created_at);
                this.timeCreatedFormatted = formatDateTime(tweet.created_at);
                this.postUrl = `https://twitter.com/${this.post.screen_name}/status/${tweet.tweet_id_str}`;
                this.mediaUrl = tweet.media_url;
                this.mediaType = tweet.media_url && tweet.media_url.indexOf('youtu') !== -1 ? 'youtube' : 'image';
                this.mediaSourceUrl = this.postUrl;
                this.author = `${tweet.name} (@${tweet.screen_name})`;
                this.authorId = tweet.user_id_str;
                this.profileImageUrl = tweet.profile_image_url;

                if (this.mediaType === 'youtube') {
                    const urlParts = this.mediaUrl.split('/');
                    this.youtubeId =  urlParts[urlParts.length - 1];
                }
                break;
            }

            case 'facebook_post': {
                const { facebook_post } = flockler.attachments;

                this.timeCreated = new Date(facebook_post.created_time);
                this.timeCreatedFormatted = formatDateTime(facebook_post.created_time);
                this.text = facebook_post.message;
                this.author = facebook_post.from_name;
                this.authorId = facebook_post.from_id_str;
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
        if (this.isFeatured()) {
            this.element.classList.add('feedItem--featured')
        }
        this.element.style.animationDelay = `${index * 50}ms`
        this.element.dataset.rating = this.ratingValue;
        this.element.innerHTML = this.generateHtml();

        appendRating(this.element, this.postId);

        return this.element;
    }

    isFeatured() {
        return featuredAuthorIds.includes(this.authorId);
    }

    generateHtml() {
        return `
            ${DebugInfosComponent({
                ratingValue: this.ratingValue,
                ratingCount: this.ratingCount,
                timeCreatedFormatted: this.timeCreatedFormatted
            })}

            ${(this.mediaUrl) ? `
                <a class="feedItem__imageLink feedItem__imageLink--${this.mediaType}" href="${this.mediaSourceUrl}" target="_blank">    
                    ${this.mediaType === 'youtube' ? `
                        <iframe
                            frameborder="0"
                            scrolling="no"
                            marginheight="0"
                            marginwidth="0"
                            height="240"
                            type="text/html"
                            src="https://www.youtube.com/embed/${this.youtubeId}?autoplay=0&fs=1"
                        >
                        </iframe>
                    ` : `
                        <img class="feedItem__image" src="${this.mediaUrl}" />
                    `}
                </a>
            ` : ''}
            <div class="feedItem__body">
                <div class="feedItem__meta">
                    <div class="feedItem__profileImage" style="background-image: url('${this.profileImageUrl}')"></div>
                    <div class="feedItem__author">${this.author}</div>
                    ${SharingComponent(this.postUrl)}
                </div>

                <div class="feedItem__content">${urlify(this.text)}</div>
            </div>
        `;
    } 

    updateRating({ rating_value, rating_count }) {
        this.ratingValue = rating_value;
        this.ratingCount = rating_count;

        this.element.dataset.rating = this.ratingValue;
        this.element.querySelector('.feedItem__debugInfos .rating-value').innerText = this.ratingValue;
        this.element.querySelector('.feedItem__debugInfos .rating-count').innerText = this.ratingCount;
    }
}
