const template = document.createElement("template");
template.innerHTML = `
    <style>
        :host{
            border: double;
            padding: 0.75rem 1.5rem;
            margin: 5px 8px;
            background-color: #f1efe9;
            display: grid;
            grid-template-columns: auto auto;
        }  

        a{
            color: #140083;
            text-decoration: none;
            font-size: 1rem;
        }
        a:hover{
            color: #1d00be;
            font-weight: bold;
        }

        #github{
            text-align: end;
        }
    </style>
    
<div id="name"></div>
<div id="github"></div>
<div id="org"></div> 
`;


class PKMNFooter extends HTMLElement {
    // constructor called when instance of this class is created
    constructor() {
        super();

        // 1 - Attach a shadow DOM tree to this instance (creates a '.shadowRoot' for us)
        this.attachShadow({ mode: "open" });

        // 2 - Clone 'template' and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.name = this.shadowRoot.querySelector("#name");
        this.github = this.shadowRoot.querySelector("#github");
        this.org = this.shadowRoot.querySelector("#org");
    }

    // called when the component is inserted into the DOM
    connectedCallback() {
        this.render();
    }

    // a helper method (could be named anything) to display the values of the attributes
    render() {
        // grab the attribute values and assign a default value if necessary
        const name = this.getAttribute('data-name') ? this.getAttribute('data-name') : "NAME";
        const profile_link = this.getAttribute('data-profile_link') ? this.getAttribute('data-profile_link') : "https://google.com";
        const github_link = this.getAttribute('data-github_link') ? this.getAttribute('data-github_link') : "https://github.com";
        const org = this.getAttribute('data-org') ? this.getAttribute('data-org') : "ORG";
        const org_link = this.getAttribute('data-org_link') ? this.getAttribute('data-org_link') : "https://www.rit.edu/";

        this.name.innerHTML = `<a href="${profile_link}">&copy ${name}</a>`;
        this.github.innerHTML = `<a href="${github_link}">Github</a>`;
        this.org.innerHTML = `<a href="${org_link}">${org}</a>`;
    }
}

// define our new custom element with `customElements.define()` so that we can use it on the page
customElements.define('pkmn-footer', PKMNFooter);