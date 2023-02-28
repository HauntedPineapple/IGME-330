import * as typedef from "./typedefs.js";
import * as storage from "./localStorage.js";
import * as utility from "./utils.js";
import * as firebase from "./firebase.js";

const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<style>
    :host{
        max-height: 650px;
        background-color: #f4f4f4;
        border: 2px solid #afafaf;
        overflow: auto;
        transition: all .2s ease-in-out;
        position: relative;
    }   

    #name {
        margin-top: 5px;
        font-size: 1.3rem;
        font-weight: bold;
        text-align: center;
    }

    img {
        max-width: 200px;
        width: 100%;
        height: auto;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }

    #type, #pkmn-id{
        font-size: 1.1rem;
        text-align: center;
        margin-bottom: 0;
    }

    #pkmn-id{
        font-size: 1.05rem;
        margin-top: 2px;
    }

   #stats {
        font-size: 1rem;
        padding: 0.75rem;
        padding-top: 0.25rem;
        font-weight: normal;
        
    }

    @media only screen and (max-width: 768px) {
        #stats {
            text-align: center;
        }
    }

    @media only screen and (min-width: 1100px) {
        #stats {
            text-align: center;
        }
    }

    #stats p {
        display: inline;
        font-weight: bold; 
    }

    #star-button{
        margin-top: 5px;
        margin-left: 5px;
        transition: all .2s ease-in-out;
    }

    #star-button:hover{
        transform: scale(1.2);
    }
</style>

<input type="image" id="star-button" alt="*" src="images/empty-star.png" width="23">
<h2 class="card-header-title is-centered is-size-4" id="name">Pokemon Name</h2>
<div class="card-image">
    <figure class="image">
        <img id="sprite" src="images/questionmark.png">
    </figure>
</div>
<div class="card-content">
    <div class="content">
        <p id="type">Type</p>
        <p id="pkmn-id">ID</p>
        <div id="stats">
            <div id="hp">HP</div>
            <div id="speed">Speed</div>
            <div id="attack">Attack</div>
            <div id="special-attack">Sp Atk</div>
            <div id="defense">Defense</div>
            <div id="special-defense">Sp Def</div>
        </div>
    </div>
</div>
`;

// Create a class and extend HTMLElement
class PKMNCard extends HTMLElement {
    // #1 - constructor called when instance of this class is created
    constructor() {
        super();
        // 1 - Attach a shadow DOM tree to this instance (creates a '.shadowRoot' for us)
        this.attachShadow({ mode: "open" });
        // 2 - Clone 'template' and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.button = this.shadowRoot.querySelector("#star-button");
        this.name = this.shadowRoot.querySelector("#name");
        this.sprite = this.shadowRoot.querySelector("#sprite");
        this.type = this.shadowRoot.querySelector("#type");
        this.pkmn_id = this.shadowRoot.querySelector("#pkmn-id");
        this.stats = this.shadowRoot.querySelector("#stats");
        this.hp = this.shadowRoot.querySelector("#hp");
        this.speed = this.shadowRoot.querySelector("#speed");
        this.attack = this.shadowRoot.querySelector("#attack");
        this.special_attack = this.shadowRoot.querySelector("#special-attack");
        this.defense = this.shadowRoot.querySelector("#defense");
        this.special_defense = this.shadowRoot.querySelector("#special-defense");
    }

    // #2 - called when the component is inserted into the DOM
    connectedCallback() {
        // Set Bulma classes
        this.className = "tile is-child is-3";
        //this.className = "column is-one-quarter card";

        this.isFavorited = this.getAttribute('data-favorited') ? this.getAttribute('data-favorited') : false;
        // console.log("In pkmn-card connectedCallback(): this.isFavorited typeof = ", typeof this.isFavorited);
        // console.log("In pkmn-card connectedCallback(): this.isFavorited = ", this.isFavorited);
        // if (this.isFavorited.toLowerCase() == "false") { 
        //     console.log("It's false");
        // }
        // if(this.isFavorited.toLowerCase() == "true"){
        //     console.log("It's true");
        // }

        // draw page
        this.render();
        // we could also hookup some JavaScript to DOM events

        // add favorite button handler
        this.button.onclick = () => {
            let pokemonObj = { "id": this.getAttribute('data-pkmn_id'), "name": this.getAttribute('data-name').toLowerCase(), "url": `https://pokeapi.co/api/v2/pokemon/${this.getAttribute('data-pkmn_id')}/` };
            // Need to force it into being a string or the console throws an error because sometimes
            // this.isFavorited is a string and sometimes it is a boolean
            if (String(this.isFavorited).toLowerCase() == "true") {
                this.isFavorited = false;
                storage.removeFavorite("https://pokeapi.co/api/v2/pokemon/" + this.getAttribute('data-pkmn_id') + "/");
                firebase.removeFavoriteFromCloud(pokemonObj);
                this.render();
            }
            else if (String(this.isFavorited).toLowerCase() == "false") {
                this.isFavorited = true;
                storage.addFavorite(pokemonObj);
                firebase.addFavoriteToCloud(pokemonObj);
                this.render();
            }

            console.log("Favorites button was clicked! this.isFavorited = ", this.isFavorited);
            //console.log("this.isFavorited typeof = ", typeof this.isFavorited);
        }
    }

    // #3 - called when the component is removed from the DOM
    disconnectedCallback() {
        // a good place to clean up, remove event listeners, etc ...
        this.button.onclick = null; // remove favorite button handler
    }

    // #4 - this lifecycle method is invoked each time one of the component's "watched" attributes changes
    attributeChangedCallback(attributeName, oldVal, newVal) {
        //console.log(`Attribute "${attributeName}" changed from "${oldVal}" to "${newVal}"`);
        this.render();
    }

    // #5 - here were specify for which attributes we want to be notified when their values change
    static get observedAttributes() {
        return ["data-favorited"];
    }

    // #6 - a helper method (could be named anything) to display the values of the attributes
    render() {
        // update the DOM in some way based on the value of the attributes
        const name = this.getAttribute('data-name') ? this.getAttribute('data-name') : "???";
        const sprite = this.getAttribute('data-sprite') ? this.getAttribute('data-sprite') : "images/questionmark.png";
        const type = this.getAttribute('data-type') ? this.getAttribute('data-type') : "???";
        const pkmn_id = this.getAttribute('data-pkmn_id') ? this.getAttribute('data-pkmn_id') : "???";
        const hp = this.getAttribute('data-hp') ? this.getAttribute('data-hp') : "???";
        const speed = this.getAttribute('data-speed') ? this.getAttribute('data-speed') : "???";
        const attack = this.getAttribute('data-attack') ? this.getAttribute('data-attack') : "???";
        const special_attack = this.getAttribute('data-special_attack') ? this.getAttribute('data-special_attack') : "???";
        const defense = this.getAttribute('data-defense') ? this.getAttribute('data-defense') : "???";
        const special_defense = this.getAttribute('data-special_defense') ? this.getAttribute('data-special_defense') : "???";

        const fixedName = utility.fixName(name).toUpperCase();
        // this.name.innerHTML = utility.makeLinkElement(fixedName, fixedName, false);
        this.name.innerHTML = `${fixedName}`;
        this.sprite.setAttribute("src", sprite);
        this.type.innerHTML = `Type: ${type}`;
        this.pkmn_id.innerHTML = `ID: ${pkmn_id}`;
        this.hp.innerHTML = `HP: ${hp}`;
        this.speed.innerHTML = `Speed: ${speed}`;
        this.attack.innerHTML = `Attack: ${attack}`;
        this.special_attack.innerHTML = `Sp Atk: ${special_attack}`;
        this.defense.innerHTML = `Defense: ${defense}`;
        this.special_defense.innerHTML = `Sp Defense: ${special_defense}`;

        // console.log("In pkmn-card render(): this.isFavorited typeof = ", typeof this.isFavorited);
        // console.log("In pkmn-card render(): this.isFavorited = ", this.isFavorited);
        // Need to force it into being a string or the console throws an error because sometimes
        // this.isFavorited is a string and sometimes it is a boolean
        if (String(this.isFavorited).toLowerCase() == "true") {
            this.button.setAttribute("src", "images/filled-star.png");
            this.button.setAttribute("opacity", 1);
        }
        else if (String(this.isFavorited).toLowerCase() == "false") {
            this.button.setAttribute("src", "images/empty-star.png");
            this.button.setAttribute("opacity", 0.4);
        }
    }
} // end class

// #7 - define our new custom element with `customElements.define()` so that we can use it on the page
customElements.define('pkmn-card', PKMNCard);