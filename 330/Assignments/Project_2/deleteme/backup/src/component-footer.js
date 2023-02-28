const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<style>
    :host {
        display: grid;
        grid-template-columns: 30% 30% 30%;
        grid-gap: 10%;
        margin: 0px;
        padding: 20px 15px 7px 15px;
        background-color: #54ade0;
        flex-shrink: 0;
        font-size: .89rem;
    }

    a {
        display: block;
        color: black;
        padding: none;
        margin: none;
    }

    #left {
        justify-self: end;
        text-align: end;
    }

    #middle {
        justify-self: center;
        text-align: center;
    }

    #right {
        justify-self: start;
        text-align: start;
    }
</style>

<div id="left">
    <a href="">LINK</a>
    <a href="">LINK</a>
</div>
<div id="middle">
    <a href="">LINK</a>
    <a href="">LINK</a>
</div>
<div id="right">
    <a href="">LINK</a>
    <a href="">LINK</a>
</div>
`;

// Create a class and extend HTMLElement
class CustomFooter extends HTMLElement {
    // constructor called when instance of this class is created
    constructor() {
        super();
        // 1 - Attach a shadow DOM tree to this instance (creates a '.shadowRoot' for us)
        this.attachShadow({ mode: "open" });
        // 2 - Clone 'template' and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.link1 = this.shadowRoot.querySelector("#left>a:nth-child(1)");
        this.link2 = this.shadowRoot.querySelector("#left>a:nth-child(2)");
        this.link3 = this.shadowRoot.querySelector("#middle>a:nth-child(1)");
        this.link4 = this.shadowRoot.querySelector("#middle>a:nth-child(2)");
        this.link5 = this.shadowRoot.querySelector("#right>a:nth-child(1)");
        this.link6 = this.shadowRoot.querySelector("#right>a:nth-child(2)");
    }

    // called when the component is inserted into the DOM
    connectedCallback() {
        // draw page
        this.render();
        // we could also hookup some JavaScript to DOM events
    }

    // called when the component is removed from the DOM
    disconnectedCallback() {
        // a good place to clean up, remove event listeners, etc ...
    }

    // this lifecycle method is invoked each time one of the component's "watched" attributes changes
    attributeChangedCallback(attributeName, oldVal, newVal) {
        console.log(attributeName, oldVal, newVal);
        this.render();
    }

    // here were specify for which attributes we want to be notified when their values change
    static get observedAttributes() {
        return ["data-year", "data-text"];
    }

    // a helper method (could be named anything) to display the values of the attributes
    render() {
        // update the DOM in some way based on the value of the attributes
        // grab the attribute values and assign a default value if necessary
        // const data = this.getAttribute('data-data') ? this.getAttribute('data-data') : "Some data";
        // this.shadowRoot.querySelector("#output").innerHTML = `Data: ${data}`;
        const link_1_name = this.getAttribute('data-link1-name') ? this.getAttribute('data-link1-name') : "";
        const link_1_url = this.getAttribute('data-link1-url') ? this.getAttribute('data-link1-url') : "";
        this.link1.innerHTML = link_1_name;
        this.link1.setAttribute("href", link_1_url);

        const link_2_name = this.getAttribute('data-link2-name') ? this.getAttribute('data-link2-name') : "";
        const link_2_url = this.getAttribute('data-link2-url') ? this.getAttribute('data-link2-url') : "";
        this.link2.innerHTML = link_2_name;
        this.link2.setAttribute("href", link_2_url);

        const link_3_name = this.getAttribute('data-link3-name') ? this.getAttribute('data-link3-name') : "";
        const link_3_url = this.getAttribute('data-link3-url') ? this.getAttribute('data-link3-url') : "";
        this.link3.innerHTML = link_3_name;
        this.link3.setAttribute("href", link_3_url);

        const link_4_name = this.getAttribute('data-link4-name') ? this.getAttribute('data-link4-name') : "";
        const link_4_url = this.getAttribute('data-link4-url') ? this.getAttribute('data-link4-url') : "";
        this.link4.innerHTML = link_4_name;
        this.link4.setAttribute("href", link_4_url);

        const link_5_name = this.getAttribute('data-link5-name') ? this.getAttribute('data-link5-name') : "";
        const link_5_url = this.getAttribute('data-link5-url') ? this.getAttribute('data-link5-url') : "";
        this.link5.innerHTML = link_5_name;
        this.link5.setAttribute("href", link_5_url);

        const link_6_name = this.getAttribute('data-link6-name') ? this.getAttribute('data-link6-name') : "";
        const link_6_url = this.getAttribute('data-link6-url') ? this.getAttribute('data-link6-url') : "";
        this.link6.innerHTML = link_6_name;
        this.link6.setAttribute("href", link_6_url);
    }

} // end class

// define our new custom element with `customElements.define()` so that we can use it on the page
customElements.define('custom-footer', CustomFooter);