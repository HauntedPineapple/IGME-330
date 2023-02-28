import * as storage from "./localStorage.js";
import * as utility from "./utils.js";

const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<style>
    :host{
        padding: 15px 30px;
        display: block;
    } 
</style>
<nav class="pagination is-centered" role="navigation" aria-label="pagination">
    <button id="previous-button" class="button pagination-previous">Previous</button>
    <button id="next-button" class="button pagination-next">Next</button>
    <ul class="pagination-list" id="page-list"></ul>
</nav>
`;

// Create a class and extend HTMLElement
class PKMNPaginator extends HTMLElement {
    // #1 - constructor called when instance of this class is created
    constructor() {
        super();
        // 1 - Attach a shadow DOM tree to this instance (creates a '.shadowRoot' for us)
        this.attachShadow({ mode: "open" });
        // 2 - Clone 'template' and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.previousBtn = this.shadowRoot.querySelector("#previous-button");
        this.nextBtn = this.shadowRoot.querySelector("#next-button");
        this.pageList = this.shadowRoot.querySelector("#page-list");

        this.pokemonArray = this.getAttribute('data-pokemon_array') ? this.getAttribute('data-pokemon_array') : [];
        this.numPages =  this.getAttribute('data-num_pages') ? this.getAttribute('data-num_pages') : "1";
        this.numPages = Number(this.numPages);
        this.currentPage = 1;

        this.paginationEllipse = '<li><span class="pagination-ellipsis">&hellip;</span></li>';
    }

    // #2 - called when the component is inserted into the DOM
    connectedCallback() {
        this.previousBtn.onlick = (e) => {
            this.currentPage--;
            console.log("this.currentPage = ", this.currentPage);
            console.log("Previous button clicked");
            this.render();
        }

        this.nextBtn.onlick = (e) => {
            this.currentPage = this.currentPage + 1;
            console.log("this.currentPage = ", this.currentPage);
            console.log("Next button clicked");
            this.render();
        }

        this.render();
    }

    // #3 - called when the component is removed from the DOM
    disconnectedCallback() {
        // a good place to clean up, remove event listeners, etc ...
        this.previousBtn.onlick = null;
        this.nextBtn.onlick = null;
    }

    // #4 - this lifecycle method is invoked each time one of the component's "watched" attributes changes
    attributeChangedCallback(attributeName, oldVal, newVal) {
        console.log(attributeName, oldVal, newVal);
        this.render();
    }

    // #5 - here were specify for which attributes we want to be notified when their values change
    static get observedAttributes() {
        return ["data-num_pages", "data-current_page"];
    }

    // #6 - a helper method (could be named anything) to display the values of the attributes
    render() {
        if (this.numPages == 1) { // don't show up if there is just the one page
            this.shadowRoot.innerHTML = "";
        }
        else {
            // reset stuff
            this.pageList.innerHTML = "";
            this.previousBtn.disabled = false;
            this.nextBtn.disabled = false;

            if (this.currentPage == 1) {
                this.previousBtn.disabled = true;
            }
            else if (this.currentPage == this.numPages) {
                this.nextBtn.disabled = true;
            }

            if (this.numPages > 10) {
                // handle creating ellipses and whatnot
            }
            else {
                for (let i = 0; i < this.numPages; i++) {
                    let pageButton = document.createElement("a");
                    pageButton.innerHTML = `${i + 1}`;
                    if (i + 1 == this.currentPage) {
                        pageButton.className = "pagination-link is-current";
                    }
                    else {
                        pageButton.className = "pagination-link";
                        // hook up button events and stuff
                        pageButton.onclick = () => {
                            console.log(`Page button ${i + 1} clicked`);
                            this.currentPage = i + 1;
                            this.render();
                            pageButton.onclick = null;
                        }
                    }
                    this.pageList.appendChild(pageButton);
                }
            }
        }

    }

} // end class

// #7 - define our new custom element with `customElements.define()` so that we can use it on the page
customElements.define('pkmn-paginator', PKMNPaginator);