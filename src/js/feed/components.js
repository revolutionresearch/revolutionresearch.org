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
    timeCreatedFormatted,
    orderType
}) {
    return `
    <div class="feedItem__debugInfos">
        Rating: <span class="rating-value">${ratingValue}</span>,
        Count: <span class="rating-count">${ratingCount}</span>,
        Created: ${timeCreatedFormatted}${orderType ? `, order: ${orderType}` : ''}
    </div>
    `;
}

module.exports = {
    SharingComponent,
    DebugInfosComponent
};
