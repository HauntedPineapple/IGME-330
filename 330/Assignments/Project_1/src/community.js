import * as firebase from "./firebase.js";

function favoritesChanged(snapshot) {
    document.querySelector("#favorites-table").innerHTML = '<tr><th>Sprite</th><th>ID</th><th>Name</th><th>Times Favorited</tr>';

    snapshot.forEach(pokemon => {
        const childKey = pokemon.key;
        const childData = pokemon.val();
        // console.log(childKey, childData);

        let rowItem = document.createElement("tr");
        let sprite = document.createElement("img");
        let spriteDiv = document.createElement("div");
        sprite.setAttribute("src", `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${childData.pokemon.id}.png`);
        sprite.setAttribute("width", "100px");
        spriteDiv.appendChild(sprite);
        rowItem.appendChild(spriteDiv);
        rowItem.innerHTML += `<td>${childData.pokemon.id}</td>`;
        rowItem.innerHTML += `<td>${childData.pokemon.name}</td>`;
        rowItem.innerHTML += `<td>${childData.count}</td>`;
        document.querySelector("#favorites-table").appendChild(rowItem);
    });
}
let favoritesRef = firebase.ref(firebase.db, `${firebase.favoritesPath}`);
firebase.onValue(favoritesRef, favoritesChanged);