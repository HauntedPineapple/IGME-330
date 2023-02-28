/* Checked by ESLint - https://eslint.org/demo */
import * as storage from "./localStorage.js";

let listFavorites = null;

const showAppTitle = () => {
  // grab the app title
  // update the <title> element and the "title" <div>
};

const showFavorites = () => {
  // grab the array of favorites from localStorage and 
  // update `listFavorites`
};

const init = () => {
  showAppTitle();
  listFavorites = document.querySelector("#list-favorites");
  showFavorites();

  /* Event Handlers */
  document.querySelector("#btn-clear-favorites").onclick = () => {
    // get this button working
  };

  document.querySelector("#btn-app-preferences").onclick = () => {
    // get this button working
  };


  // https://developer.mozilla.org/en-US/docs/Web/API/Window/focus_event
  // window.onfocus = ...

  // even better!
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
  // window.onstorage = () => {
  //   showFavorites();
  //   showAppTitle();
  // };

};

init();
