import SWCharacter from "./SWCharacter.js";

const template = document.createElement("template");
template.innerHTML = `
<style>
  #container{
    border:1px solid black;
    display:inline-block;
    width:200px;
    height:300px;
    overflow:auto;
    padding:.5em;
  }
  h1{
    font-size:1.3em;
  }
</style>
<div id="container">
  <h1>???</h1>
  <p>Hair color: ???, eye color: ???</p>
  <p><button>Favorite Me!</button></p>
</div>
`;

class SWCard extends HTMLElement {
  constructor (){
    super();
    this.attachShadow({"mode": "open"});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.character = new SWCharacter("Gonk","none","none");
    this.callback = (character) => console.log("Character clicked in sw-card.js=", character);
  }

  connectedCallback (){
    this.h1 = this.shadowRoot.querySelector("h1");
    this.p = this.shadowRoot.querySelector("p");
    this.btnFavorite = this.shadowRoot.querySelector("button");
    this.btnFavorite.onclick = (evt) => {
      this.callback(this.character);
      evt.target.innerHTML = "Favorited!";
      evt.target.disabled = true;
    };
    this.render();
  }

  render(){
    this.h1.innerHTML = this.character.name;
    this.p.innerHTML = `<p>Hair color: ${this.character.hairColor}, eye color: ${this.character.eyeColor}</p>`;
  }
}

customElements.define("sw-card", SWCard);
