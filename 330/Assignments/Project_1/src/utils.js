import * as typedef from "./typedefs.js";
import * as storage from "./localStorage.js";

/* 
https://jsdoc.app/index.html
https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
*/

/**
 * @typedef {number[]} baseStatArray  hp, attack, defense, special-attack, special-defense, speed
 *
 * @typedef {Object} pokemonObject
 * @property {number} id
 * @property {string} name
 * @property {string} url - PokeAPI url
 * @property {string} sprite - sprite url
 * @property {string[]} types
 * 
 * @typedef {Object} basicPokemonObject
 * @property {number} id
 * @property {string} name
 * @property {string} url - PokeAPI url
 * 
 * @typedef {basicPokemonObject[]} pokemonArray
 */

let card;

/** * @param {pokemonArray} pokemonArray  */
export function createOutput(pokemonArray) {
    if (pokemonArray.length == 0) {
        return;
    }
    //console.log("In createOutput()");
    //console.log("In createOutput() pokemonArray = ", pokemonArray);

    const outputArea = document.querySelector("#output");
    let counter = 0; // counts how many cards have been made

    //console.log("pokemonArray.length: ", pokemonArray.length);
    //console.log("Math.ceil(pokemonArray.length / 4: ", Math.ceil(pokemonArray.length / 4));
    for (let i = 0; i < Math.ceil(pokemonArray.length / 4); i++) { // Create row every 4 cards
        if (!pokemonArray[counter]) {
            break; // if there is no card to be made, stop
        }

        let cardRow = document.createElement("div"); // Create row container
        cardRow.setAttribute("class", "tile is-parent"); // Assign Bulma classes

        for (let j = 0; j < 4; j++) { // Create cards
            if (!pokemonArray[counter]) {
                break; // if there is no card to be made, stop
            }

            loadJsonFetch(pokemonArray[counter]["url"], json => {
                card = document.createElement("pkmn-card");
                let isFavorited = false;

                if (getUrlArray(storage.getFavorites()).includes(`https://pokeapi.co/api/v2/pokemon/${json["id"]}/`)) {
                    // if the url already exists in the favorites array, mark it as such
                    isFavorited = true;
                }

                //console.log("CARD JSON", json);

                // Populate cards with data
                card.dataset.name = json["name"].toUpperCase() ?? "???";
                //card.dataset.name = pokemonArray[counter]["name"].toUpperCase() ?? "???";

                card.dataset.sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${json["id"]}.png`;

                let typeinfo = json["types"][0]["type"]["name"];
                if (json["types"].length == 2) {
                    typeinfo += ` & ${json["types"][1]["type"]["name"]}`;
                }
                card.dataset.type = typeinfo ?? "???";

                card.dataset.pkmn_id = json["id"] ?? "???";

                // the pokeAPIs json["stats"] array contains (in this order): hp, attack, defense, special-attack, special-defense, speed
                card.dataset.hp = json["stats"][0]["base_stat"] ?? "???";
                card.dataset.speed = json["stats"][5]["base_stat"] ?? "???";
                card.dataset.attack = json["stats"][1]["base_stat"] ?? "???";
                card.dataset.special_attack = json["stats"][3]["base_stat"] ?? "???";
                card.dataset.defense = json["stats"][2]["base_stat"] ?? "???";
                card.dataset.special_defense = json["stats"][4]["base_stat"] ?? "???";

                card.dataset.favorited = isFavorited;
                cardRow.appendChild(card);
            });
            counter++;
        }
        outputArea.appendChild(cardRow);
    }
}

/**
 * Returns the given number rewritten to have a defined number of leading zeroes if needed
 * @param {Number} num - Integer to give the the needed leading zeroes
 * @param {Number} length -  Number of digits the numbers end length must be
 * @returns {string} The number given with the appropriate amount of leading zeroes
 */
export function giveLeadingZeros(num, length) {
    let numDigits = Math.abs(num).toString().length;
    if (numDigits >= length) return num.toString(); // return since it needs no leading zeroes
    let zeroString = Math.pow(10, length - numDigits).toString().substring(1);
    let finalNumber = "";
    if (num < 0) finalNumber += "-";
    finalNumber += zeroString + Math.abs(num);
    return finalNumber;
}

/** * @param {basicPokemonObject} a * @param {basicPokemonObject} b  */
export function sortAlphabetical(a, b) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
}

/** * @param {basicPokemonObject} a * @param {basicPokemonObject} b  */
export function sortReverseAlphabetical(a, b) {
    if (a.name > b.name) return -1;
    if (a.name < b.name) return 1;
    return 0;
}

/** * @param {basicPokemonObject} a * @param {basicPokemonObject} b  */
export function sortNumerical(a, b) {
    // let a_ID = a.url.replace("https://pokeapi.co/api/v2/pokemon/", "");
    // a_ID = a_ID.replace("/", "");
    // let b_ID = b.url.replace("https://pokeapi.co/api/v2/pokemon/", "");
    // b_ID = b_ID.replace("/", "");
    // if (Number(a_ID) < Number(b_ID)) return -1;
    // if (Number(a_ID) > Number(b_ID)) return 1;
    if (Number(a.id) < Number(b.id)) return -1;
    if (Number(a.id) > Number(b.id)) return 1;
    return 0;
}

/** * @param {basicPokemonObject} a * @param {basicPokemonObject} b  */
export function sortReverseNumerical(a, b) {
    // let a_ID = a.url.replace("https://pokeapi.co/api/v2/pokemon/", "");
    // a_ID = a_ID.replace("/", "");
    // let b_ID = b.url.replace("https://pokeapi.co/api/v2/pokemon/", "");
    // b_ID = b_ID.replace("/", "");
    // if (Number(a_ID) < Number(b_ID)) return -1;
    // if (Number(a_ID) > Number(b_ID)) return 1;
    if (Number(a.id) > Number(b.id)) return -1;
    if (Number(a.id) < Number(b.id)) return 1;
    return 0;
}

/** To help search the urls using .includes()
 * @param {urlObj[]} arrayWithUrlObjects array that contains url objects
 * @returns {Array} an array that only contains the url values*/
export function getUrlArray(arrayWithUrlObjects) {
    let urlArray = [];
    for (let obj of arrayWithUrlObjects) {
        urlArray.push(obj["url"]);
    }
    return urlArray;
}

/** To help search the names using .includes()
 * @param {nameObj[]} arrayWithNameObjects array that contains objects formatted like this: {"name": string}
 * @returns {Array} an array that only contains the name values */
export function getNameArray(arrayWithNameObjects) {
    let nameArray = [];
    for (let obj of arrayWithNameObjects) {
        nameArray.push(obj["name"]);
    }
    return nameArray;
}

const ALLOWEDSUFFIXES = ["jr", "mime", "o", "z", "oh", "koko", "lele", "bulu", "fini", "null", "rime"];
export function fixName(name) {
    name = name.toLowerCase();
    let afterHyphen = name.split("-")[1];
    if (!name.includes("-")) {
        return name;
    }
    if (name.includes("nidoran")) {
        if (afterHyphen == "f") { // probably nidoran-female, change the 'f' to a female symbol
            return name.split("-")[0] + " &#9792";
        }
        else { // probably nidoran-male, change the 'm' to a male symbol
            return name.split("-")[0] + " &#9794";
        }
    }

    for (let suffix of ALLOWEDSUFFIXES) {
        if (afterHyphen.includes(suffix)) {
            return name; // the suffix is valid
        }
    }// we assume at this point that the suffix isn't valid
    return name.split("-")[0];
}

export function fixNames(pokemonArray) {
    let names = getNameArray(pokemonArray);

    for (let i = 0; i < pokemonArray.length; i++) {
        names[i] = names[i].toLowerCase();
        let afterHyphen = names[i].split("-")[1];
        if (!names[i].includes("-")) {
            continue;
        }
        else {
            if (names[i].includes("nidoran")) {
                if (afterHyphen == "f") { // probably nidoran-female, change the 'f' to a female symbol
                    pokemonArray[i].name = names[i].split("-")[0] + "&#9792";
                }
                else { // probably nidoran-male, change the 'm' to a male symbol
                    pokemonArray[i].name = names[i].split("-")[0] + "&#9794";
                }
                continue;
            }

            for (let suffix of ALLOWEDSUFFIXES) {
                if (afterHyphen.includes(suffix)) {
                    break; // the suffix is valid, so go to the next name in the array
                }
            }// we assume at this point that the suffix isn't valid, and we change it
            pokemonArray[i].name = names[i].split("-")[0];
        }
    }
    return pokemonArray;
}

/** Creates a link to a specified Pokemon's Pokemon Database link
 * @param {string} name Name of the Pokemon to get the link for
 * @returns {string} Link to the Pokemon Database page for the given Pokemon
 */
function createDBLink(name) {
    return `https://pokemondb.net/pokedex/${name.toLowerCase()}/`;
}

/** Creates a link to a specified Pokemon's Bulbapedia link
 * @param {string} name Name of the Pokemon to get the link for
 * @returns {string} Link to the Bulbapedia page for the given Pokemon
 */
function createBulbaLink(name) {
    return `https://bulbapedia.bulbagarden.net/wiki/${name.toLowerCase()}_(Pokemon)`;
}

/**
 * Creates a link element for the pokemon
 * @param {string} name the name of the pokemon to make the link for
 * @param {string} text the text to display 
 * @param {boolean} isBulba - If true, creates a Bulbapedia link. If false, creates a PokemonDB link.
 * @returns the created link element
 */
export function makeLinkElement(name, text, isBulba) {
    let link = document.createElement("a");
    let url = "";
    if(isBulba){
        url = createBulbaLink(name);
    }
    else{
        url = createDBLink(name);
    }
    link.setAttribute("href", url);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    link.innerHTML = text;
    console.log(text);
    console.log(link);
    return link;
}

/** @param {string} url @param {function} callback */
const loadJsonFetch = (url, callback) => {
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

export { loadJsonFetch, createBulbaLink, createDBLink };