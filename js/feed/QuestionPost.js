class QuestionPost {
    constructor(post) {
        this.post = post;
        this.postId = this.post.post_id;
        this.type = this.post.post_type;
        this.title = this.post.post_title;
        this.guid = this.post.guid;
        this.ratingValue = this.post.rating.value || 0;
        this.ratingCount = this.post.rating.count || 0;
    }

    createElement(index = 0) {
        this.element = document.createElement('div');

        this.element.className = `feedItem feedItem--question`;
        this.element.style.animationDelay = `${index * 50}ms`
        this.element.dataset.rating = this.ratingValue;
        this.element.innerHTML = this.generateHtml();

        // appendNoUiSlider(this.element, this.postId);

        return this.element;
    }

    generateHtml() {
        return `
            <h3>${this.title}</h3>
        `;
    }
}
