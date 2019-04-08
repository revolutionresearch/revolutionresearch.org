// function RatingComponent(postId) {
//     return `
//         <div class="rating">
//             <label for="${postId}" class="rating__label">
//                 Wie sinnvoll findest Du diesen Beitrag?
//             </label>
//             <div class="rating__wrapper">
//                 <span class="rating__emoji">😒</span>
//                 <input
//                     class="rating__input"
//                     value="0"
//                     id="${postId}"
//                     data-id="${postId}"
//                     type="range"
//                     min="-4"
//                     max="4"
//                     step="1"
//                 />
//                 <span class="rating__emoji">😊</span>
//             </div>
//             <div className='rating__nouislider'></div>
//         </div>
//     `;
// }


function SharingComponent(postUrl) {
    return `
        <div class="feedItem__sharing">
            <a href="https://www.facebook.com/sharer/sharer.php?u=${postUrl}" title="Auf Facebook teilen!" target="_blank" rel="noopener noreferrer">
                <i class="fa fa-facebook"></i>
            </a>
            <a href="https://twitter.com/home?status=${postUrl}" title="Auf Twitter teilen!" target="_blank" rel="noopener noreferrer">
                <i class="fa fa-twitter"></i>
            </a>
        </div>
    `;
}

function DebugInfosComponent({
    ratingValue,
    ratingCount,
    timeCreatedFormatted
}) {
    return `
    <div class="feedItem__debugInfos">
        Rating: <span class="rating-value">${ratingValue}</span>,
        Count: <span class="rating-count">${ratingCount}</span>,
        Created: ${timeCreatedFormatted}
    </div>
    `;
}
