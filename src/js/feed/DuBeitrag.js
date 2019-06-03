const appendRating = require('./rating');
const { SharingComponent } = require('./components');
const { urlify, withLineBreaks } = require('../utils');

class DuBeitrag {
    constructor(post) {
        this.post = post;
        this.postId = this.post.post_id;
        this.postUrl = this.post.post_url;
        this.type = this.post.post_type;
        this.content = this.post.post_content;
        this.imageUrl = this.post.post_thumbnail_url;

        if (this.post.youtube_url.length) {
            const urlParts = this.post.youtube_url.split('?v=');
            this.youtubeId =  urlParts[1];
        }
    }

    createElement(index = 0) {
        this.element = document.createElement('div');

        this.element.className = `feedItem feedItem--flockler`;
        this.element.style.animationDelay = `${index * 50}ms`
        this.element.innerHTML = this.generateHtml();

        appendRating(this.element, this.postId);

        return this.element;
    }

    generateHtml() {
        return `
            ${(this.youtubeId && !this.imageUrl) ? `
                <a class="feedItem__imageLink feedItem__imageLink--youtube" href="${this.post.youtube_url}" target="_blank">    
                    <iframe
                        frameborder="0"
                        scrolling="no"
                        marginheight="0"
                        marginwidth="0"
                        height="240"
                        type="text/html"
                        src="https://www.youtube.com/embed/${this.youtubeId}?autoplay=0&fs=1"
                        allowfullscreen="allowfullscreen"
                        mozallowfullscreen="mozallowfullscreen" 
                        msallowfullscreen="msallowfullscreen" 
                        oallowfullscreen="oallowfullscreen" 
                        webkitallowfullscreen="webkitallowfullscreen"
                    >
                    </iframe>
                </a>
            ` : ''}
            ${(this.imageUrl) ? `
                <a class="feedItem__imageLink feedItem__imageLink--image" href="${this.imageUrl}" target="_blank">    
                    <img class="feedItem__image" src="${this.imageUrl}" />
                </a>
            ` : ''}

            <div class="feedItem__body">
                <div class="feedItem__meta">
                <div class="feedItem__profileImage"></div>
                    <div class="feedItem__author">Besucher</div>
                    ${SharingComponent(this.postUrl)}
                </div>

                ${this.content ? `
                    <div class="feedItem__content">
                        ${urlify(withLineBreaks(this.content))}
                    </div>
                ` : ''}
            </div>
        `;
    }
}

module.exports = DuBeitrag;