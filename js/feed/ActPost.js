class ActPost {
    constructor(post) {
        this.post = post;
        this.postId = this.post.post_id;
        this.type = this.post.post_type;
        this.title = this.post.post_title;
    }

    createElement(index = 0) {
        this.element = document.createElement('div');

        this.element.className = `feedItem feedItem--act`;
        this.element.style.animationDelay = `${index * 50}ms`
        this.element.innerHTML = this.generateHtml();

        return this.element;
    }

    generateHtml() {
        return `
            <div class="feedItem__body">
                <h3>${this.title}</h3>
            </div>
        `;
    }
}
