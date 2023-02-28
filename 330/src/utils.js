// https://jsdoc.app/index.html
// https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html

/** Returns the given number rewritten to have a defined number of leading zeroes if needed
 * @param {Number} num - Integer to give the the needed leading zeroes
 * @param {Number} length -  Number of digits the numbers end length must be
 * @returns {string} The number given with the appropriate amount of leading zeroes */
export function giveLeadingZeros(num, length) {
    let numDigits = Math.abs(num).toString().length;
    if (numDigits >= length) return num.toString(); // return since it needs no leading zeroes
    let zeroString = Math.pow(10, length - numDigits).toString().substring(1);
    let finalNumber = "";
    if (num < 0) finalNumber += "-";
    finalNumber += zeroString + Math.abs(num);
    return finalNumber;
}

/** @param {string} url @param {function} callback */
export function loadJsonFetch(url, callback) {
    fetch(url)
        .then(response => {
            // If the response is successful, return the JSON
            if (response.ok) {
                return response.json();
            }

            // else throw an error that will be caught below
            return response.text().then(text => {
                throw text;
            });
        }) // send the response.json() promise to the next .then()
        .then(json => { // the second promise is resolved, and `json` is a JSON object
            callback(json);
        }).catch(error => {
            // error
            console.log(error);
        });
};

export function getRandomRGBColor() {
    function getByte() {
        return 55 + Math.round(Math.random() * 200);
    }
    return "rgb(" + getByte() + "," + getByte() + "," + getByte() + ")";
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Applies a CSS animation to an element
 * https://vanillajstoolkit.com/helpers/animate/
 * @param  {Node}     node      The element to animate
 * @param  {String}   animation The animation class to apply
 * @param  {Function} onEnd     A callback function to run when the animation ends [optional] */
export function animate(node, animation, onEnd = function () { }) {
    node.classList.add(animation);
    node.addEventListener('animationend', () => {
        node.classList.remove(animation);
        onEnd(node, animation);
    },
        { once: true });
}

/** Randomly shuffles an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {Array}       The shuffled array */
export function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/** Run a callback function after scrolling has stopped
 * https://vanillajstoolkit.com/helpers/scrollstop/
 * @param  {Function} callback The callback function to run after scrolling
 * @param  {Integer}  refresh  How long to wait between scroll events [optional] */
export function scrollStop(callback, refresh = 66) {

    // Make sure a valid callback was provided
    if (!callback || typeof callback !== 'function') return;

    // Setup scrolling variable
    let isScrolling;

    // Listen for scroll events
    window.addEventListener('scroll', function (event) {
        // Clear our timeout throughout the scroll
        window.clearTimeout(isScrolling);

        // Set a timeout to run after scrolling ends
        isScrolling = setTimeout(callback, refresh);
    },
        false);
}

/**
 * Get the contrasting color for any hex color
 * https://vanillajstoolkit.com/helpers/getcontrast/
 * @param  {String} A hexcolor value
 * @return {String} The contrasting color (black or white) */
export function getContrast(hexcolor) {

    // If a leading # is provided, remove it
    if (hexcolor.slice(0, 1) === '#') {
        hexcolor = hexcolor.slice(1);
    }

    // If a three-character hexcode, make six-character
    if (hexcolor.length === 3) {
        hexcolor = hexcolor.split('').map(function (hex) {
            return hex + hex;
        }).join('');
    }

    // Convert to RGB value
    let r = parseInt(hexcolor.substr(0, 2), 16);
    let g = parseInt(hexcolor.substr(2, 2), 16);
    let b = parseInt(hexcolor.substr(4, 2), 16);

    // Get YIQ ratio
    let yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    // Check contrast
    return (yiq >= 128) ? 'black' : 'white';

}

/**
 * Create a random color value.
 * https://vanillajstoolkit.com/helpers/createcolor/
 * @return {String} A random six-digit color hexcode */
export function createColor() {

    // The available hex options
    let hex = ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    // Randomly shuffle an array
    // https://stackoverflow.com/a/2450976/1293256
    let shuffle = function () {

        let currentIndex = hex.length;
        let temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = hex[currentIndex];
            hex[currentIndex] = hex[randomIndex];
            hex[randomIndex] = temporaryValue;
        }
    };

    //Create a six-digit hex color
    let hexColor = function () {

        // Create the color
        let color = '#';

        // Shuffle the hex values and append
        for (let i = 0; i < 6; i++) {
            shuffle(hex);
            color += hex[0];
        }

        return color;
    };
    // Return the color string
    return hexColor();
}