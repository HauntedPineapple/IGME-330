"use strict";

// let words1 = [];
// let words2 = [];
// let words3 = [];

// array to be filled with arrays of words
let wordArrays = [[], [], []]; 

loadJSON();

function loadJSON() {
    const url = "data/babble-data.json";
    const xhr = new XMLHttpRequest();

    xhr.onload = (e) => {
        const json = JSON.parse(e.target.responseText);
        const keyArray = Object.keys(json);
        let i = 0; // counter so that we can loop through our nested array
        // loop through the keys and look at the object linked to the specific key
        for (let key of keyArray) {
            const obj = json[key];
            wordArrays[i] = obj["wordlist"]; //we get the data from obj that is tagged as "wordlist"
            i++;
        }

        // we wait until the xhr has loaded before running any functions that require our word list to be populated
        createWord();

        document.querySelector("#oneMoreButton").onclick = createWord;
        document.querySelector("#fiveMoreButton").onclick = createFiveWords;
    };

    xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
    xhr.open("GET", url);
    xhr.send();
}

function generateNumOfWords(num) {
    let newOutput = "";
    for (let i = 0; i < num; i++) {
        newOutput += "<p>" + `${getRandomElement(wordArrays[0])} ${getRandomElement(wordArrays[1])} ${getRandomElement(wordArrays[2])}` + "</p>";
    }
    document.querySelector("#output").innerHTML = newOutput;
}

function createWord() {
    generateNumOfWords(1);
}

function createFiveWords() {
    generateNumOfWords(5);
}

function getRandomElement(givenArray) {
    let randomIndex = Math.floor(Math.random() * givenArray.length);
    return givenArray[randomIndex];
}