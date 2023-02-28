import * as typedef from "./typedefs.js";
import { getUrlArray } from "./utils.js";

const key = "aam6039-p1-settings";

const defaultData = {
    "search_term": "",
    "favorites": [{ "name": "", "url": "" }],
    "sortby": "numerical",
    "type1": "none",
    "type2": "none",
    "generation": "none",
    "num_per_page": "32",
    "current_page": "1",
    "results": []
}


//#region Sort By Dropdown
export const getSortBy = () => readLocalStorage().sortby;

export const setSortBy = (data) => {
    const allvalues = readLocalStorage();
    allvalues.sortby = data;
    writeLocalStorage(allvalues);
};

export const resetSortBy = () => {
    const allValues = readLocalStorage();
    allValues.sortby = "numerical";
    writeLocalStorage(allValues);
};
//#endregion

//#region Type Filter 1
export const getType1 = () => readLocalStorage().type1;

export const setType1 = (data) => {
    const allvalues = readLocalStorage();
    allvalues.type1 = data;
    writeLocalStorage(allvalues);
};

export const resetType1 = () => {
    const allValues = readLocalStorage();
    allValues.type1 = "none";
    writeLocalStorage(allValues);
};
//#endregion

//#region Type Filter 2
export const getType2 = () => readLocalStorage().type2;

export const setType2 = (data) => {
    const allvalues = readLocalStorage();
    allvalues.type2 = data;
    writeLocalStorage(allvalues);
};

export const resetType2 = () => {
    const allValues = readLocalStorage();
    allValues.type2 = "none";
    writeLocalStorage(allValues);
};
//#endregion

//#region Generation Filter
export const getGenerationFilter = () => readLocalStorage().generation;

export const setGenerationFilter = (data) => {
    const allvalues = readLocalStorage();
    allvalues.generation = data;
    writeLocalStorage(allvalues);
};

export const resetGenerationFilter = () => {
    const allValues = readLocalStorage();
    allValues.generation = "none";
    writeLocalStorage(allValues);
};
//#endregion

//#region Results
export const getResults = () => readLocalStorage().results;

export const addResult = (data) => {
    const allvalues = readLocalStorage();
    allvalues.results.push(data);
    writeLocalStorage(allvalues);

    console.log("Result item added: ", data);
};

export const clearResults = () => {
    const allValues = readLocalStorage();
    allValues.results = [];
    writeLocalStorage(allValues);

    console.log("Result array cleared!");
};

export const removeResults = (url) => {
    const allValues = readLocalStorage();
    let urlValues = getUrlArray(getFavorites());
    if (urlValues.includes(url)) {
        allValues.results.splice(urlValues.indexOf(url), 1);
    }
    writeLocalStorage(allValues);

    console.log("Result item removed: ", url);
}
//#endregion

//#region Favorites
export const getFavorites = () => readLocalStorage().favorites;

export const addFavorite = (data) => {
    const allvalues = readLocalStorage();
    allvalues.favorites.push(data);
    writeLocalStorage(allvalues);

    console.log("Favorite item added: ", data);
};

export const clearFavorites = () => {
    const allValues = readLocalStorage();
    allValues.favorites = [];
    writeLocalStorage(allValues);

    console.log("Favorite array cleared!");
};

export const removeFavorite = (url) => {
    const allValues = readLocalStorage();
    let urlValues = getUrlArray(getFavorites());
    if (urlValues.includes(url)) {
        allValues.favorites.splice(urlValues.indexOf(url), 1);
    }
    writeLocalStorage(allValues);

    console.log("Favorite item removed: ", url);
}
//#endregion

const readLocalStorage = () => {
    let allvalues = null;

    try {
        allvalues = JSON.parse(localStorage.getItem(key));
    } catch (err) {
        console.log(`Problem with JSON.parse() and ${key} !`);
        throw err;
    }

    return allvalues;
};

const writeLocalStorage = (allValues) => {
    localStorage.setItem(key, JSON.stringify(allValues));
};

export const clearLocalStorage = () => writeLocalStorage(defaultData);