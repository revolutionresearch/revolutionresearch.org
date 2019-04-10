function userFormSubmitHandler(e) {
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

function userFormMediaTypeChangeHandler(e) {
    const target = e.currentTarget || e.srcElement;
    const value = target.value;
    const id = target.dataset.id;

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

function userFormContentInputHandler(e) {
    const target = e.currentTarget || e.srcElement;
    target.parentNode.querySelector('.content-chars').textContent = target.value.length;
}

function userFormImageChangeHandler(e) {
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
