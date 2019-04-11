class QuestionPost {
    constructor(post) {
        this.post = post;
        this.type = this.post.post_type;
    }

    createElement(index = 0) {
        this.index = index;
        this.element = document.createElement('div');

        this.element.className = `feedItem feedItem--form`;
        this.element.style.animationDelay = `${index * 50}ms`
        this.element.innerHTML = this.generateDefaultHtml();

        this.addEventListeners();

        return this.element;
    }

    addEventListeners() {
        // open form
        this.element.querySelector('.feedItem__teaser-button').addEventListener('click', this.openFormHandler);
        this.element.querySelector('.user-submit-form').addEventListener('submit', this.userFormSubmitHandler);
        this.element.querySelector('[name=content]').addEventListener('input', this.userFormContentInputHandler);
        this.element.querySelector('[name=media-type]').addEventListener('change', this.userFormMediaTypeChangeHandler);
        this.element.querySelector('[name=image]').addEventListener('change', this.userFormImageChangeHandler);
    }

    generateDefaultHtml() {
        return `
            <div class="feedItem__body">
                <div class="feedItem__form-teaser">
                    <h3>DU</h3>
                    <button class="feedItem__teaser-button">Hier kannst Du posten!</button>
                </div>
                ${this.generateFormHtml()}
            </div>
        `;
    }

    generateFormHtml() {
        const index = this.index;

        return `
            <form class='user-submit-form' id='user-submit-form-${index}' data-id="${index}">
                <label for='content-${index}'>Text (<span class='content-chars'>0</span> von 280 Zeichen)</label>
                <textarea class='field' name='content' id='content-${index}' rows='10' maxlength='280'></textarea>

                <label for='media-type-${index}'>Bild oder YouTube-Video</label>
                <select class='field' name='media-type' id='media-type-${index}' data-id='${index}'>
                    <option value='image'>Bild</option>
                    <option value='youtube'>YouTube</option>
                </select>
                
                <div class='image-wrapper' id='image-wrapper-${index}'>
                    <label id='image-label-${index}'>Bitte lade eine Bilddatei hoch</label>
                    <input type='file' accept='image/*' name='image' id='image-${index}' style='display: none;'/>
                    <input class='image-button' type='button' value='Bild auswählen...' onclick='document.getElementById(\"image-${index}\").click();' />
                </div>

                <div class='youtube-wrapper' id='youtube-wrapper-${index}' style='display: none;'>
                    <label id='youtube-label-${index}'>Bitte füge einen YouTube-Link ein</label>
                    <input type='url' name='youtube' id='youtube-${index}' placeholder='https://www.youtube.com/watch?v=HZhFC11uB3Q' />
                </div>

                <button type='submit'>Senden!</button>
            </form>
        `;
    }

    openFormHandler({ target }) {
        if (target.classList.contains('feedItem__teaser-button')) {
            target.parentNode.style.display = 'none';
            target.parentNode.parentNode.querySelector('form')
                .style.display = 'block';
        }
    }

    userFormSubmitHandler(e) {
        e = e || window.event;
        const currentTarget = e.currentTarget || e.srcElement;
    
        e.preventDefault();
        const form = currentTarget;
        const formId = form.dataset.id;
    
        const content = form.querySelector('[name=content]').value;
        const media_type = form.querySelector('[name=media-type]').value;
        const image = form.querySelector('[name=image]').value;
        const youtube = form.querySelector('[name=youtube]').value;
    
        const values = { content, media_type, image, youtube };
    
        console.log('submit', values);
    }
    
    userFormMediaTypeChangeHandler(e) {
        const target = e.currentTarget || e.srcElement;
        const value = target.value;
        const id = target.dataset.id;
        console.log('change media type', { id, target });
    
        const youtube = document.getElementById(`youtube-wrapper-${id}`);
        const image = document.getElementById(`image-wrapper-${id}`);
    
        if (value === 'youtube') {
            youtube.style.display = 'block';
            image.style.display = 'none';
            
        } else if (value === 'image') {
            image.style.display = 'block';
            youtube.style.display = 'none';
        }
    }
    
    userFormContentInputHandler(e) {
        const target = e.currentTarget || e.srcElement;
        target.parentNode.querySelector('.content-chars').textContent = target.value.length;
    }
    
    userFormImageChangeHandler(e) {
        const target = e.currentTarget || e.srcElement;
        const value = target.value;
        const imageButton = target.nextElementSibling;
    
        if (value === '') {
            imageButton.value = 'Bild auswählen...';
        } else {
            const fileNameParts = value.split('\\');
            imageButton.value = fileNameParts[fileNameParts.length - 1];
        }
    }
}

module.exports = QuestionPost;