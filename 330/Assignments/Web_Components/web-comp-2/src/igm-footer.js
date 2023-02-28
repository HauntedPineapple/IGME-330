const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host{
            background-color: #ddd;
            display:block;
            user-select: none;
        }
        
        span{
            color: #F76902;
            font-variant: small-caps;
            font-weight: bolder;
            font-family: sans-serif;
        }   
        
        hr{
            border: 3px solid red;
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

        if (!this.dataset.year) this.dataset.year = 1989;
        if (!this.dataset.text) this.dataset.text = "Bill & Ted";

        // This line of code will create a property named `span` for us, so that we don't have to keep calling this.shadowRoot.querySelector("span");
        this.span = this.shadowRoot.querySelector("span");

        this.count = 0;
    }

    // called when the component is inserted into the DOM
    connectedCallback() {
        this.span.onclick =  () => {
            console.log(this.count)
            this.count = this.count + 1;
            this.render();
        };

        this.shadowRoot.querySelector("hr").onclick = () => {
            this.remove();
        }

        this.render();
    }

    // This will be called when the component is removed from the DOM
    disconnectedCallback() {
        this.span.onclick = null;
    }

    // a helper method (could be named anything) to display the values of the attributes
    render() {
        // grab the attribute values and assign a default value if necessary
        const year = this.getAttribute('data-year') ? this.getAttribute('data-year') : "1995";
        const text = this.getAttribute('data-text') ? this.getAttribute('data-text') : "Nobody";

        this.shadowRoot.querySelector("span").innerHTML = `&copy; Copyright ${year}, ${text}, count: ${this.count}`;
        console.log(this.count);
    }

    // specifes which attributes we want to be notified when their values change
    static get observedAttributes() {
        return ["data-year", "data-text"];
    }

    // called each time one of the component's "watched" attributes changes
    attributeChangedCallback(attributeName, oldVal, newVal) {
        console.log(attributeName, oldVal, newVal);
        this.render();
    }
}

// define our new custom element with `customElements.define()` so that we can use it on the page
customElements.define('igm-footer', IGMFooter);