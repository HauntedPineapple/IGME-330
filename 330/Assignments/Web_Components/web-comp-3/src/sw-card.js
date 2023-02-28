const template = document.createElement("template");
template.innerHTML = `
<style>
  #card{
    height: 340px;
    width: 170px;
    border: 1px solid gray;
    padding: .5rem;
    background-color: #f4f4f4;
    overflow: auto;
    font-size: .7rem;
    position: relative;
  }

  h2{
    font-size: 1.1rem;
    font-family: SfDistantGalaxy, sans-serif;
    letter-spacing: .67px;
    line-height: 1.2;
    margin-top: 0;
  }

  img{
    width: 100px;
  }

  button{
    border-radius: 1px;
    padding: 2px;
    position: absolute;
    top: 1px;
    right: 1px;
    opacity: 0.2;
  }
  button:hover{
    opacity: 1;
  }
</style>

<div id="card">
  <h2></h2>
  <button>X</button>
  <img alt="mugshot">
  <p id="swcHeight">Height:</p>
  <p id="swcMass">Mass:</p>
  <p id="swcSpecies">Species:</p>
  <div id="swcAffiliations">Affiliations:</div>
</div>
`;

class SWCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.button = this.shadowRoot.querySelector("button");
    this.h2 = this.shadowRoot.querySelector("h2");
    this.img = this.shadowRoot.querySelector("img");
    this.p1 = this.shadowRoot.querySelector("#swcHeight");
    this.p2 = this.shadowRoot.querySelector("#swcMass");
    this.p3 = this.shadowRoot.querySelector("#swcSpecies");    
    this.affiliationList = this.shadowRoot.querySelector("#swcAffiliations");
  }

  connectedCallback() {
    this.button.onclick = () => this.remove();
    this.render();
  }

  disconnectedCallback() {
    this.button.onclick = null;
  }

  attributeChangedCallback(attributeName, oldVal, newVal) {
    console.log(attributeName, oldVal, newVal);
    this.render();
  }

  static get observedAttributes() {
    //return ["data-name", "data-height", "data-mass", "data-image"]
  }

  render() {
    const name = this.getAttribute('data-name') ? this.getAttribute('data-name') : "<i>...character name...</i>";
    const imageUrl = this.getAttribute('data-image') ? this.getAttribute('data-image') : "images/catimage-no-image.png";
    const height = this.getAttribute('data-height') ? this.getAttribute('data-height') : "0";
    const mass = this.getAttribute('data-mass') ? this.getAttribute('data-mass') : "0";
    const species = this.getAttribute('data-species') ? this.getAttribute('data-species') : "null";
    const affiliations = this.getAttribute('data-affiliations') ? this.getAttribute('data-affiliations') : "None";

    this.h2.innerHTML = `${name}`;
    this.img.src = imageUrl;
    this.p1.innerHTML = `Height: ${height}`;
    this.p2.innerHTML = `Mass: ${mass}`;
    this.p3.innerHTML = `Species: ${species}`;
    if(affiliations == "None" || affiliations == "none"){
      this.affiliationList.innerHTML = `Affiliations: <b>NONE</b>`;
    }
    else{
      this.affiliationList.innerHTML = "Affiliations: <ul>";
      this.affiliationList.innerHTML += this.createList(affiliations);
      this.affiliationList.innerHTML += "</ul>";
    }    
  }

  createList(arraystring){
    const array = arraystring.split(",");

    return array.map(item => `<li>${item}</li>`).join('');
  }
}

customElements.define('sw-card', SWCard);