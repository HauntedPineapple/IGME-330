const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host{
            background-color: #ddd;
            display:block;
        }
        
        span{
            color: #F76902;
            font-variant: small-caps;
            font-weight: bolder;
            font-family: sans-serif;
        }   
    </style>
    <span></span>
    <hr>
`;


class IGMFooter extends HTMLElement {
    // constructor called when instance of this class is created
    constructor() {
        super();

        // 1 - Attach a shadow DOM tree to this instance (creates a '.shadowRoot' for us)
        this.attachShadow({ mode: "open" });

        // 2 - Clone 'template' and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    // called when the component is inserted into the DOM
    connectedCallback() {
        this.render();
    }

    // a helper method (could be named anything) to display the values of the attributes
    render() {
        // grab the attribute values and assign a default value if necessary
        const year = this.getAttribute('data-year') ? this.getAttribute('data-year') : "1995";
        const text = this.getAttribute('data-text') ? this.getAttribute('data-text') : "Nobody";

        this.shadowRoot.querySelector("span").innerHTML = `&copy; Copyright ${year}, ${text}`;
    }
}

// define our new custom element with `customElements.define()` so that we can use it on the page
customElements.define('igm-footer', IGMFooter);