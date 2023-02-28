import * as typedef from "./typedefs.js";
import * as storage from "./localStorage.js";
import * as utility from "./utils.js";
import "./pkmn-card.js";
import "./pkmn-paginator.js";

const key = "aam6039-p1-settings";
const output = document.querySelector("#output");
const paginationArea = document.querySelector("#pagination");
const resultsPerPage = document.querySelector("#display-number");
resultsPerPage.value = "32"; // set the default
let resultsArray = [];
let pages = [];
let numPages = 1;
// the number of pages will be `Math.ceil(pokemonArray.length / number results per page)`
let currentPage = 1;

loadJSONXHR();


function loadJSONXHR() {
    const url = "deleteme/test.json";
    const xhr = new XMLHttpRequest();

    xhr.onload = (e) => {
        console.log(`In onload - HTTP Status Code - ${e.target.status}`);

        const text = e.target.responseText;
        const json = JSON.parse(text);
        //console.log("In loadJSONXHR(): json = ", json);
        console.log("In loadJSONXHR(): json['results'] = ", json["results"]);
        createPagination(json["results"]);
        //loadCards(json["results"]);
        //createOutput(json["results"]);
    };

    xhr.onerror = e => console.log(`In onerror - HTTP Status Code = ${e.target.status}`);
    xhr.open("GET", url);
    xhr.send();
}

function createPagination(json){
    if (resultsPerPage.value == "all") {
        currentPage = 1;
        createOutput(json);
    }
    else{
        numPages = Math.ceil(json.length / Number(resultsPerPage.value));
    }
}

function loadCards(pokemonArray) {
    
}



function createOutput(pokemonArray) {
    if (pokemonArray.length == 0) {
        return;
    }
    console.log("In createOutput()");
    console.log("In createOutput() pokemonArray = ", pokemonArray);

    const outputArea = output;
    outputArea.innerHTML = "";
    let counter = 0; // counts how many cards have been made

    //console.log("pokemonArray.length: ", pokemonArray.length);
    //console.log("Math.ceil(pokemonArray.length / 4): ", Math.ceil(pokemonArray.length / 4));
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

            const card = document.createElement("pkmn-card");
            const fetchPromise = async () => {
                let isFavorited = false;

                // await ("stay on this line") until the first promise is resolved, meaning the data has downloaded
                let response = await fetch(pokemonArray[counter]["url"]);

                // If the response is not successful, throw an error
                if (!response.ok) {
                    if (response.status == 404) console.log("Do 404 stuff");
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                // await ("stay on this line") until the second promise is resolved, meaning we now have a JSON object
                let json = await response.json();

                //console.log("CARD JSON", json);

                // Populate cards with data
                card.dataset.name = json["name"].toUpperCase() ?? "???";

                if (json["sprites"]["other"]["official-artwork"]["front_default"] != null) {
                    card.dataset.sprite = json["sprites"]["other"]["official-artwork"]["front_default"];
                }
                else if (json["sprites"]["home"] != null && json["sprites"]["home"]["front_default"] != null) {
                    card.dataset.sprite = json["sprites"]["home"]["front_default"];
                }
                else {
                    card.dataset.sprite = json["sprites"]["front_default"] ?? "../images/questionmark.png";
                }

                let typeinfo = json["types"][0]["type"]["name"];
                if (json["types"].length == 2) {
                    typeinfo += ` & ${json["types"][1]["type"]["name"]}`;
                }
                card.dataset.type = typeinfo ?? "???";

                card.dataset.pkmn_id = json["id"] ?? "???";

                // the json["stats"] array contains (in this order): hp, attack, defense, special-attack, special-defense, speed
                card.dataset.hp = json["stats"][0]["base_stat"] ?? "???";
                card.dataset.speed = json["stats"][5]["base_stat"] ?? "???";
                card.dataset.attack = json["stats"][1]["base_stat"] ?? "???";
                card.dataset.special_attack = json["stats"][3]["base_stat"] ?? "???";
                card.dataset.defense = json["stats"][2]["base_stat"] ?? "???";
                card.dataset.special_defense = json["stats"][4]["base_stat"] ?? "???";

                // console.log("In createOutput(): isFavorited = ", isFavorited);
                // console.log("In createOutput(): isFavorited typeof = ", typeof isFavorited);
                card.dataset.favorited = isFavorited;

                cardRow.appendChild(card);
            };

            fetchPromise()
                .catch(e => {
                    console.log(`In catch in createOutput() with e = ${e}`);
                    console.log(`Line: ${e.lineNumber}`); // only works on Firefox
                });
            counter++;
        }
        outputArea.appendChild(cardRow);
    }
}