const template = document.createElement("template");
template.innerHTML = `
<style>
    :host{
            
    }   
</style>
<div id="id-name">Sample component</div>
<div id="output"></div>
`;

// Create a class and extend HTMLElement
class MyElement extends HTMLElement {
    // #1 - constructor called when instance of this class is created
    constructor() {
        super();
        // 1 - Attach a shadow DOM tree to this instance (creates a '.shadowRoot' for us)
        this.attachShadow({ mode: "open" });
        // 2 - Clone 'template' and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // other setup
        // for example:
        this.component = this.shadowRoot.querySelector("#id-name");
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
        return ["data-year", "data-text"];
    }

    // #6 - a helper method (could be named anything) to display the values of the attributes
    render() {
        // update the DOM in some way based on the value of the attributes
        //  for example: <my-element data-data = "Data"></my-element> 
        const data = this.getAttribute('data-data') ? this.getAttribute('data-data') : "Some data";
        this.shadowRoot.querySelector("#output").innerHTML = `Data: ${data}`;
    }

} // end class

// #7 - define our new custom element with `customElements.define()` so that we can use it on the page
customElements.define('my-element', MyElement);