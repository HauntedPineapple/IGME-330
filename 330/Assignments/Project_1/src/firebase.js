import * as typedef from "./typedefs.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, ref, get, set, push, onValue } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDAewFdVXP5kAuc2KBwQKBSK3esA301yWM",
    authDomain: "pokefinder-app-559f3.firebaseapp.com",
    projectId: "pokefinder-app-559f3",
    storageBucket: "pokefinder-app-559f3.appspot.com",
    messagingSenderId: "284196573982",
    appId: "1:284196573982:web:58d851c0147de75a286f0f"
};

const favoritesPath = "favorited-pokemon/";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(app);
const db = getDatabase();

export const addFavoriteToCloud = (pokemon) => {
    const favRef = ref(db, `${favoritesPath}${pokemon.id}`);
    let count = 1;
    get(favRef).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            count += snapshot.val().count;
            set(favRef, { pokemon, "count": count });
        } else {
            console.log("No data available");
            set(favRef, { pokemon, "count": 1 });
        }
    }).catch((error) => {
        console.error(error);
    });
};

export const removeFavoriteFromCloud = (pokemon) => {
    const favRef = ref(db, `${favoritesPath}${pokemon.id}`);
    let count = 0;
    get(favRef).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            count = snapshot.val().count - 1;
            if (count <= 0) {
                set(favRef, {});
            }
            else {
                set(favRef, { pokemon, "count": count });
            }
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
    set(favRef, {});
};

export function incrementFavorite(pokemon) {

}
export function decrementFavorite(pokemon) {

}

export { db, favoritesPath, ref, set, push, onValue };