"use strict";

// global arrays initialized outside of any functions
let words1 = [];
let words2 = [];
let words3 = [];

loadCSV();
function loadCSV() {
    const url = "data/babble-data.csv";
    const xhr = new XMLHttpRequest();

    xhr.onload = (e) => {
        console.log(`In onload - HTTP Status Code - ${e.target.status}`);

        const file = e.target.responseText;
        // make arrays based on the lines of the csv
        const lines = file.split("\n"); 

        // create an array based off the words that are separated by a ","
        words1 = lines[0].split(",");
        words2 = lines[1].split(",");
        words3 = lines[2].split(",");

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
        newOutput += "<p>" + `${getRandomElement(words1)} ${getRandomElement(words2)} ${getRandomElement(words3)}` + "</p>";
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