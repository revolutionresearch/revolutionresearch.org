const noUiSlider = require('nouislider');

function appendRating(parent, postId) {
    const nouiRating = document.createElement('div');

    let ratings = localStorage.getItem('projekt-zukunft-ratings');
    ratings = ratings ? JSON.parse(ratings) : {};

    noUiSlider.create(nouiRating, {
        start: ratings[postId] || 0,
        step: 1,
        // padding: 1,
        range: {
            'min': -4, // 1 value is used as padding
            'max': 4 // 1 value is used as padding
        }
    });

    if (ratings[postId]) {
        nouiRating.classList.add('set');
    }

    const fakeFill = document.createElement('div');
    fakeFill.classList.add('fake-fill');
    nouiRating.querySelector('.noUi-base').appendChild(fakeFill);

    function handleRatingSet([ value ]) {
        console.log({ postId, value: parseInt(value, 10) });
        const rating = this;

        // get previous value from local storage
        let ratings = localStorage.getItem('projekt-zukunft-ratings');
        ratings = ratings ? JSON.parse(ratings) : {};

        let fetchOptions;
        
        if (ratings[postId]) {
            const old_value = parseInt(ratings[postId], 10);
            const new_value = parseInt(value, 10);

            if (new_value === 0) {
                // delete old rating
                rating.classList.remove('set');
                fetchOptions = {
                    method: 'DELETE',
                    body: JSON.stringify({ value: old_value })
                };
                delete ratings[postId];
            } else {
                // update rating
                fetchOptions = {
                    method: 'PUT',
                    body: JSON.stringify({ old_value, new_value })
                };
                ratings[postId] = value;
            }
        } else {
            // create rating
            rating.classList.add('set');
            fetchOptions = {
                method: 'POST',
                body: JSON.stringify({ value })
            };
            ratings[postId] = value;
        }

        // update database
        fetch(`${PHP_VARS.API_URL}/flockler/${postId}/rating`, {
            credentials: 'include', // ms edge fix
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },    
            ...fetchOptions
        });

        // update local storage
        localStorage.setItem('projekt-zukunft-ratings', JSON.stringify(ratings));
    }

    function handleFakeFillOnUpdate(values, handle, unencoded, tap, positions) {
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
    nouiRating.noUiSlider.on('update', handleFakeFillOnUpdate.bind(handleFakeFillOnUpdate));

    parent.appendChild(nouiRating);
}

module.exports = appendRating;
