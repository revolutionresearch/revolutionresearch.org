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

/**
 * Finds urls in a string and replaces
 * them with an anchor tag
 * source: https://stackoverflow.com/a/1500501
 * @param {string} text 
 */
function urlify(text, newTab = true) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
        return `<a href="${url}" target="${newTab ? '_blank' : ''}">${url}</a>`;
    });
}


/**
 * Replaces all line breaks with <br /> tags
 * source: https://stackoverflow.com/a/784547/8936417
 * @param {string} string 
 */
function withLineBreaks(string) {
    return string.replace(/(?:\r\n|\r|\n)/g, '<br />');
}


module.exports = {
    randomIntFromInterval,
    formatDateTime,
    urlify,
    withLineBreaks,
};
