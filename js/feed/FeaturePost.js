class FeaturePost {
    constructor(post) {
        this.post = post;
        console.log('feature', this.post);
        this.postId = this.post.post_id;
        this.type = this.post.post_type;
        this.title = this.post.post_title;
        this.guid = this.post.guid;
        this.ratingValue = this.post.rating.value || 0;
        this.ratingCount = this.post.rating.count || 0;
        this.content = this.post.post_content;
        this.mediaUrl = this.post.post_thumbnail_url;
        this.author = this.post.author.display_name || 0;
    }

    createElement(index = 0) {
        this.element = document.createElement('div');

        this.element.className = `feedItem feedItem--feature`;
        this.element.style.animationDelay = `${index * 50}ms`
        this.element.dataset.rating = this.ratingValue;
        this.element.innerHTML = this.generateHtml();

        return this.element;
    }

    generateHtml() {
        return `
            <h3>${this.title}</h3>
            <br />
            ${this.mediaUrl ? `<img src="${this.mediaUrl}" />` : ''}
            ${this.content ? this.content : ''}
            ${this.author ? `by ${this.author}` : ''}
        `;
    }
}
