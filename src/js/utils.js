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


/**
 * Checks if a DOM element is a heading tag
 */
function isHeadingElement(element) {
    const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    return headings.indexOf(element.tagName) != -1;
}


/**
 * Return array for url paramaters
 * source: https://html-online.com/articles/get-url-parameters-javascript/
 */
function getUrlParameters() {
    const vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
        vars[key] = value;
    });
    return vars;
}


/**
 * Return the value of the url paramater or the defaultValue
 * source: https://html-online.com/articles/get-url-parameters-javascript/
 * @param {string} parameter
 * @param {any} defaultvalue
 */
function getUrlParameter(parameter, defaultValue){
    let urlParameter = defaultValue;
    if (window.location.href.indexOf(parameter) > -1){
        urlParameter = getUrlParameters()[parameter];
    }
    return urlParameter;
}


module.exports = {
    randomIntFromInterval,
    formatDateTime,
    urlify,
    withLineBreaks,
    isHeadingElement,
    getUrlParameters,
    getUrlParameter,
};
