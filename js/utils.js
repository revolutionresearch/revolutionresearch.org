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