const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<style>
    :host{
            
    }   
</style>
<nav class="navbar is-dark">
    <div class="navbar-brand">
        <div class="navbar-item">
            <img src="images/Poké_Ball_icon.svg" alt="pokeball" width="50">
        </div>
        <a class="navbar-burger" id="burger">
            <span></span>
            <span></span>
            <span></span>
        </a>
    </div>
    <div class="navbar-menu" id="nav-menu">
        <div id="navbar-links" class="navbar-start">
        </div>
    </div>
</nav>
`;

// Create a class and extend HTMLElement
class pkmnNavbar extends HTMLElement {
    // #1 - constructor called when instance of this class is created
    constructor() {
        super();
        // 1 - Attach a shadow DOM tree to this instance (creates a '.shadowRoot' for us)
        this.attachShadow({ mode: "open" });
        // 2 - Clone 'template' and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.navbarLinks = this.shadowRoot.querySelector("#navbar-links");
        this.burgerIcon = this.shadowRoot.querySelector("#burger");
        this.navbarMenu = this.shadowRoot.querySelector("#nav-menu");
    }

    // #2 - called when the component is inserted into the DOM
    connectedCallback() {
        // draw page
        this.render();
        // we could also hookup some JavaScript to DOM events

        this.burgerIcon.addEventListener("click", () => {
            this.navbarMenu.classList.toggle("is-active");
            //console.log("clicked");
        });
    }

    // #3 - called when the component is removed from the DOM
    disconnectedCallback() {
        // a good place to clean up, remove event listeners, etc ...
        this.burgerIcon.removeEventListener("click");
    }

    // #4 - this lifecycle method is invoked each time one of the component's "watched" attributes changes
    attributeChangedCallback(attributeName, oldVal, newVal) {
        console.log(attributeName, oldVal, newVal);
        this.render();
    }

    // #5 - here were specify for which attributes we want to be notified when their values change
    static get observedAttributes() {
        // return ["data-year", "data-text"];
    }

    // #6 - a helper method (could be named anything) to display the values of the attributes
    render() {
        // update the DOM in some way based on the value of the attributes
        //  for example: <my-element data-data = "Data"></my-element> 
        // const data = this.getAttribute('data-data') ? this.getAttribute('data-data') : "Some data";
        // this.shadowRoot.querySelector("#output").innerHTML = `Data: ${data}`;

        let linkHTML = "";
        let links = [this.getAttribute('data-home') ? this.getAttribute('data-home') : "default"];
        links.push(this.getAttribute('data-app') ? this.getAttribute('data-app') : "default");
        links.push(this.getAttribute('data-favorites') ? this.getAttribute('data-favorites') : "default");
        links.push(this.getAttribute('data-community') ? this.getAttribute('data-community') : "default");
        links.push(this.getAttribute('data-documentation') ? this.getAttribute('data-documentation') : "default");
        let linkLabel = ["Home", "App", "Favorites", "Community", "Documentation"]

        for (let i = 0; i < links.length; i++) {
            if (links[i] == "default") {
                // if we are on the page (the link hasn't been provided), make it bold regular text
                linkHTML += `<b class="navbar-item">${linkLabel[i]}</b>`;
            }
            else {
                linkHTML += `<a class="navbar-item is-hoverable" href="${links[i]}">${linkLabel[i]}</a>`;
            }
        }
        this.navbarLinks.innerHTML = linkHTML;
    }

} // end class

// #7 - define our new custom element with `customElements.define()` so that we can use it on the page
customElements.define('pkmn-navbar', pkmnNavbar);