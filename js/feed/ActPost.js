class ActPost {
    constructor(post) {
        this.post = post;
        this.postId = this.post.post_id;
        this.type = this.post.post_type;
        this.title = this.post.post_title;
        this.content = this.post.post_content;
        this.imageUrl = this.post.post_thumbnail_url;
    }

    createElement(index = 0) {
        this.element = document.createElement('div');

        this.element.className = `feedItem feedItem--act`;
        this.element.style.animationDelay = `${index * 50}ms`
        this.element.style.backgroundImage = `url('${this.imageUrl}')`;
        this.element.innerHTML = this.generateHtml();

        return this.element;
    }

    generateHtml() {
        return `
            <div class="feedItem__body">
                ${this.content}
                <h4 class="title">${this.title}</h4>
            </div>
        `;
    }
}
