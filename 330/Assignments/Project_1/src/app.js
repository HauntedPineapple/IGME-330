import * as typedef from "./typedefs.js";
import "./pkmn-card.js";
import * as storage from "./localStorage.js";
import * as utility from "./utils.js";

console.log("Favorites: ", storage.getFavorites());

let resultsArray = [];
let pokemonArray = [];
// let resultsPages = [];
// let pokemonPages = [];

// Get the page components
const searchTerm = document.querySelector("#text-input");
const sortBy = document.querySelector("#sort-order");
// const resultsPerPage = document.querySelector("#display-number");
const generationFilter = document.querySelector("#generation");
const typeFilter1 = document.querySelector("#type-1");
const typeFilter2 = document.querySelector("#type-2");
const outputArea = document.querySelector("#output");
const resultsNumber = document.querySelector("#result-number-display");

//#region Local storage stuff
const prefix = "aam6039-";
//      Store last used search term
const termKey = prefix + "term";
const storedTerm = localStorage.getItem(termKey);
if (storedTerm) {
    searchTerm.value = storedTerm;
} else {
    searchTerm.value = "";
}
searchTerm.onchange = e => { localStorage.setItem(termKey, e.target.value); };

const storedSortBy = storage.getSortBy();
if (storedSortBy) {
    sortBy.value = storedSortBy;
} else {
    sortBy.value = "numerical";
}
sortBy.onchange = e => { storage.setSortBy(e.target.value); };

const storedGenerationFilter = storage.getGenerationFilter();
if (storedGenerationFilter) {
    generationFilter.value = storedGenerationFilter;
} else {
    generationFilter.value = "none";
}
generationFilter.onchange = e => { storage.setGenerationFilter(e.target.value); };

const storedType1Filter = storage.getType1();
if (storedType1Filter) {
    typeFilter1.value = storedType1Filter;
} else {
    typeFilter1.value = "none";
}
typeFilter1.onchange = e => { storage.setType1(e.target.value); };

const storedType2Filter = storage.getType2();
if (storedType2Filter) {
    typeFilter2.value = storedType2Filter;
} else {
    typeFilter2.value = "none";
}
typeFilter2.onchange = e => { storage.setType2(e.target.value); };
//#endregion

document.querySelector("#search-button").onclick = getResults;
document.addEventListener('keydown', function (event) {
    if (event.key == "Enter" && document.activeElement == searchTerm) {
        getResults();
    }
});

async function getResults() {
    document.querySelector("#sort-order").onchange = getResults;
    //console.clear();
    //console.log("getResults() called");

    outputArea.innerHTML = ""; // clears the page
    resultsArray = [];

    //let url = "data/pokedex.json";
    let url = "data/pokemon-basic-data.json";
    //let url = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=809"; //removes variants

    // // If there is a generation filter, will have to search in generation endpoint
    // if (generationFilter.value != "none") {
    //     url = "https://pokeapi.co/api/v2/generation/" + generationFilter.value;
    // }

    console.log("URL: ", url);
    utility.loadJsonFetch(url, json => {
        console.log(json);
        resultsArray = [...json];
        if (generationFilter.value != "none") {
            switch (generationFilter.value) {
                case "1":
                    resultsArray = [...json.slice(0, 150)];
                    break;
                case "2":
                    resultsArray = [...json.slice(151, 250)];
                    break;
                case "3":
                    resultsArray = [...json.slice(251, 385)];
                case "4":
                    resultsArray = [...json.slice(386, 492)];
                    break;
                case "5":
                    resultsArray = [...json.slice(494, 648)];
                    break;
                case "6":
                    resultsArray = [...json.slice(649, 720)];
                    break;
                case "7":
                    resultsArray = [...json.slice(721, 808)];
                    break;

                default:
                    break;
            }
        }
        if (typeFilter1.value != "none" || typeFilter2.value != "none") {
            let filteredArray = [];
            for (let result of resultsArray) {
                if (result["typeList"][0].toLowerCase() == typeFilter1.value) {
                    filteredArray.push(result);
                    continue;
                }
                if (result.typeList[0].toLowerCase() == typeFilter2.value) {
                    filteredArray.push(result);
                    continue;
                }
                if (result.typeList.length > 1) {
                    if (result.typeList[1].toLowerCase() == typeFilter1.value) {
                        filteredArray.push(result);
                        continue;
                    }
                    if (result.typeList[1].toLowerCase() == typeFilter2.value) {
                        filteredArray.push(result);
                        continue;
                    }
                }
            }
            resultsArray = [...filteredArray];
        }
        if (searchTerm != "") {
            let filteredArray = [];
            let term = searchTerm.value.trim().toLowerCase();
            for (let result of resultsArray) {
                if (result["name"].toLowerCase().includes(term)) {
                    filteredArray.push(result);
                }
            }
            resultsArray = [...filteredArray];
        }
        switch (sortBy.value) {
            case "numerical":
                resultsArray = resultsArray.sort(utility.sortNumerical);
                break;
            case "reverse-numerical":
                resultsArray = resultsArray.sort(utility.sortReverseNumerical);
                break;
            case "alphabetical":
                resultsArray = resultsArray.sort(utility.sortAlphabetical);
                break;
            case "reverse-alphabetical":
                resultsArray = resultsArray.sort(utility.sortReverseAlphabetical);
                break;
            default:
                resultsArray = resultsArray.sort(utility.sortNumerical);
        }

        if (resultsArray.length > 0) {
            console.log("resultsArray.length", resultsArray.length);
            pokemonArray = createPokemonArray(resultsArray);
            utility.createOutput(pokemonArray);
            resultsNumber.innerHTML = `<p class="px-3 is-italic has-text-justified has-text-left-desktop">${resultsArray.length} Pokemon Found<p>`;
        }
        else {
            outputArea.innerHTML = "<b>No results found! Try again.</b>";
        }

        console.log("resultsArray: ", resultsArray);
        console.log("pokemonArray: ", pokemonArray);
    });
}

/** creates basic pokemon objects (see typedef.js) */
function createPokemonArray(resultArray) {
    let newArray = [];
    for (let result of resultArray) {
        let pokemonObject = {
            "id": result["id"],
            "name": result["name"],
            "url": `https://pokeapi.co/api/v2/pokemon/${result["id"]}/`
        }
        newArray.push(pokemonObject);
    }
    return newArray;
}