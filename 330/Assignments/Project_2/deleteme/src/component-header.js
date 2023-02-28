const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<style>
    @font-face {
        font-family: 'Proza Libre';
        src: url('../data/fonts/prozalibre-regular-webfont.woff2') format('woff2'),
            url('../data/fonts/prozalibre-regular-webfont.woff') format('woff');
        font-weight: normal;
        font-style: normal;
    }
    
    h1{
        font-size: 2.5rem;
        font-family: 'Proza Libre', sans-serif;
        background-color: #54ade0;
        padding: 5px 15px;
        font-weight: bold;
        margin: 0;
    }   
</style>

<h1 id="heading"></h1>
`;

// Create a class and extend HTMLElement
class CustomHeader extends HTMLElement {
    // #1 - constructor called when instance of this class is created
    constructor() {
        super();
        // 1 - Attach a shadow DOM tree to this instance (creates a '.shadowRoot' for us)
        this.attachShadow({ mode: "open" });
        // 2 - Clone 'template' and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // other setup
        // for example:
        this.heading = this.shadowRoot.querySelector("#heading");
    }

    // #2 - called when the component is inserted into the DOM
    connectedCallback() {
        // draw page
        this.render();
        // we could also hookup some JavaScript to DOM events
    }

    // #3 - called when the component is removed from the DOM
    disconnectedCallback() {
        // a good place to clean up, remove event listeners, etc ...
    }

    // #4 - this lifecycle method is invoked each time one of the component's "watched" attributes changes
    attributeChangedCallback(attributeName, oldVal, newVal) {
        console.log(attributeName, oldVal, newVal);
        this.render();
    }

    // #5 - here were specify for which attributes we want to be notified when their values change
    static get observedAttributes() {
        // return ["data-title", "data-page"];
    }

    // #6 - a helper method (could be named anything) to display the values of the attributes
    render() {
        // update the DOM in some way based on the value of the attributes
        //  for example: <my-element data-data = "Data"></my-element> 
        let title = this.getAttribute('data-title') ? this.getAttribute('data-title') : "Web App";
        if(this.getAttribute('data-page')){
            title += `: ${this.getAttribute('data-page')}`;
        }
        this.heading.innerHTML = `${title}`;
    }

} // end class

// #7 - define our new custom element with `customElements.define()` so that we can use it on the page
customElements.define('custom-header', CustomHeader);