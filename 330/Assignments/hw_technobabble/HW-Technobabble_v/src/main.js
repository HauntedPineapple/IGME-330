"use strict";

let words1 = [];
let words2 = [];
let words3 = [];

loadXML();

function loadXML() {
    const url = "data/babble-data.xml";
    const xhr = new XMLHttpRequest();

    xhr.onload = (e) => {
        console.log(`In onload - HTTP Status Code - ${e.target.status}`);
        const xml = e.target.responseXML;
        if (!xml){ // check for valid XML
            document.querySelector("#output").innerHTML = "ERROR: XML is NULL";
            return;
        }
    
        words1 = xml.querySelector("wordlist[cid='list-1']").textContent.split(",");
        words2 = xml.querySelector("wordlist[cid='list-2']").textContent.split(",");
        words3 = xml.querySelector("wordlist[cid='list-3']").textContent.split(",");

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