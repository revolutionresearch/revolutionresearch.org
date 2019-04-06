function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1 ) + min);
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleString('de-DE', options) + ' Uhr';
}

function appendNoUiSlider(parent, postId) {
    const nouiRating = document.createElement('div');

    let ratings = localStorage.getItem('projekt-zukunft-ratings');
    ratings = ratings ? JSON.parse(ratings) : {};

    noUiSlider.create(nouiRating, {
        start: ratings[postId] || 0,
        step: 1,
        padding: 1,
        range: {
            'min': -5, // 1 value is used as padding
            'max': 5 // 1 value is used as padding
        }
    });

    if (ratings[postId]) {
        nouiRating.classList.add('set');
    }

    const fakeFill = document.createElement('div');
    fakeFill.classList.add('fake-fill');
    nouiRating.querySelector('.noUi-base').appendChild(fakeFill);

    function handleRatingSet([ value ]) {
        this.classList.add('set');
        console.log({ postId, value });
        
        let ratings = localStorage.getItem('projekt-zukunft-ratings');
        ratings = ratings ? JSON.parse(ratings) : {};
        ratings[postId] = value;
        localStorage.setItem('projekt-zukunft-ratings', JSON.stringify(ratings));

        fetch(`${apiUrl}/flockler/${postId}/rating`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },    
            method: 'POST',
            body: JSON.stringify({ value })
        });
    }

    function handleRatingUpdate(values, handle, unencoded, tap, positions) {

        const pos = positions[0];
      
        if (pos >= 50) {
            fakeFill.style.left = '50%';
            fakeFill.style.right = 'auto';
            fakeFill.style.width = (pos - 50) + '%';
        } else {
            fakeFill.style.left = 'auto';
            fakeFill.style.right = '50%';
            fakeFill.style.width = (50 - pos) + '%';
        }
      }

    nouiRating.noUiSlider.on('set', handleRatingSet.bind(nouiRating));
    nouiRating.noUiSlider.on('update', handleRatingUpdate.bind(nouiRating));

    parent.appendChild(nouiRating);
}