/* From app.js

    // try {
    //     // await ("stay on this line") until the first promise is resolved, meaning the data has downloaded
    //     let response = await fetch(url);

    //     // If the response is not successful, throw an error
    //     if (!response.ok) {
    //         if (response.status == 404) console.log("Do 404 stuff");
    //         throw new Error(`HTTP error! Status: ${response.status}`);
    //     }
    //     // await ("stay on this line") until the second promise is resolved, meaning we now have a JSON object
    //     let json = await response.json();
    //     //console.log("JSON: ", json);

    //     if (generationFilter.value != "none") {
    //         let generationResults = [];
    //         for (let species of json["pokemon_species"]) {
    //             let resultObj = {
    //                 "name": "",
    //                 "url": ""
    //             } // Create objects that are similar to the ones read from the pokemon endpoint

    //             resultObj.name = species.name;
    //             // Create pokemon url endpoint instead of species url endpoint
    //             resultObj.url = species.url.replace("pokemon-species", "pokemon");
    //             //console.log(resultObj);
    //             generationResults.push(resultObj);
    //         }
    //         let newArr = { "results": generationResults };
    //         json = JSON.parse(JSON.stringify(newArr));
    //         //console.log("newArr" ,JSON.stringify(newArr));
    //     }

    //     // Search in results for pokemon matching the criteria
    //     console.log("TERM: ", searchTerm.value);
    //     if (searchTerm.value != "") {
    //         let term = searchTerm.value.trim().toLowerCase();
    //         for (let pokemon of json["results"]) {
    //             if (pokemon["name"].includes(term)) {
    //                 resultsArray.push(pokemon);
    //             }
    //         }
    //     }
    //     else {
    //         resultsArray = json["results"];
    //     }

    //     // Filter by type (if necessary)
    //     let type1 = typeFilter1.value;
    //     let type2 = typeFilter2.value;
    //     if (type1 != "none" || type2 != "none") {
    //         let filteredArray = filterByType();
    //         //console.log("Filtered array: ", filteredArray);
    //         resultsArray = filteredArray;
    //     }

    //     // Sort results
    //     switch (sortBy.value) {
    //         case "numerical":
    //             resultsArray = resultsArray.sort(utility.sortNumerical);
    //             break;
    //         case "reverse-numerical":
    //             resultsArray = resultsArray.sort(utility.sortReverseNumerical);
    //             break;
    //         case "alphabetical":
    //             resultsArray = resultsArray.sort(utility.sortAlphabetical);
    //             break;
    //         case "reverse-alphabetical":
    //             resultsArray = resultsArray.sort(utility.sortReverseAlphabetical);
    //             break;
    //         default:
    //             resultsArray = resultsArray.sort(utility.sortNumerical);
    //     }

    //     // Display 'x' number of results per page
    //     // if(resultsPerPage.value != "all"){

    //     // }

    //     console.log("Results: ", resultsArray);
    //     console.log("Results length: ", resultsArray.length);
    //     utility.createOutput(resultsArray);
    // } catch (e) {
    //     console.log(`In catch in getResults() with e = ${e}`);
    //     console.log(`Line: ${e.lineNumber}`); // only works on Firefox
    // }


    function filterByType(pokemonArray) {
    console.log("In filterByType()");
    let filteredArray = [];
    let type1 = typeFilter1.value;
    let type2 = typeFilter2.value;
    for (let pokemon of pokemonArray) {
        const fetchPromise = async () => {
            let response = await fetch(pokemon["url"]);
            if (!response.ok) {// If the response is not successful, throw an error
                if (response.status == 404) console.log("Do 404 stuff");
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            let json = await response.json();
            //console.log("JSON: ", json);
            if (json["types"][0]["type"]["name"] == type1 || json["types"][0]["type"]["name"] == type2.value) {
                filteredArray.push(pokemon);
            }
            if (json["types"].length == 2) {
                if (json["types"][1]["type"]["name"] == type1.value || json["types"][1]["type"]["name"] == type2.value) {
                    filteredArray.push(pokemon);
                }
            }
        }
        //console.log("Filtered array: ", filteredArray);
        fetchPromise()
            .catch(e => {
                console.log(`In catch in filterByType() with e = ${e}`);
                console.log(`Line: ${e.lineNumber}`); // only works on Firefox
            });
    }
    return filteredArray;
}
*/

/* from utils.js
                    // if (json["sprites"]["other"]["official-artwork"]["front_default"] != null) {
                    //     card.dataset.sprite = json["sprites"]["other"]["official-artwork"]["front_default"];
                    //     // card.dataset.sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${json["id"]}.png`;
                    // }
                    // else if (json["sprites"]["home"] != null && json["sprites"]["home"]["front_default"] != null) {
                    //     card.dataset.sprite = json["sprites"]["home"]["front_default"];
                    // }
                    // else {
                    //     card.dataset.sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${json["id"]}.png`;
                    // }
                    //card.dataset.sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${json["id"]}.png`;
                    */