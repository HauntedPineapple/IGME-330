import * as storage from "./localStorage.js";
import * as utility from "./utils.js";

// Get the page components
const sortBy = document.querySelector("#sort-order");
//const resultsPerPage = document.querySelector("#display-number");
const outputArea = document.querySelector("#output");

document.querySelector("#delete-button").onclick = () => {
    storage.clearFavorites();
    loadPokemon();
}

sortBy.onchange = () => loadPokemon();

loadPokemon();

function loadPokemon() {
    outputArea.innerHTML = "";
    console.log("FAVORITES: ", storage.getFavorites());
    let favoritesArray = storage.getFavorites();

    if (favoritesArray.length == 0) {
        outputArea.innerHTML = `<div class="has-text-light has-background-info-dark has-text-centered">
                                    <i class="px-4 py-3 has-text-weight-semibold is-size-5">
                                        Nothing yet... Try adding some favorites
                                    </i>
                                </div>`;
        return;
    }

    switch (sortBy.value) {
        case "numerical":
            favoritesArray = favoritesArray.sort(utility.sortNumerical);
            break;
        case "reverse-numerical":
            favoritesArray = favoritesArray.sort(utility.sortReverseNumerical);
            break;
        case "alphabetical":
            favoritesArray = favoritesArray.sort(utility.sortAlphabetical);
            break;
        case "reverse-alphabetical":
            favoritesArray = favoritesArray.sort(utility.sortReverseAlphabetical);
            break;
        default:
            favoritesArray = favoritesArray.sort(utility.sortNumerical);
    }

    utility.createOutput(favoritesArray);
}