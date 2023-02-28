const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
    <style>
        :host{
            display: block;
            position: relative;
        }  

        @font-face {
            font-family: 'pokemon_solidnormal';
            src: url('../data/pokemon_solid-webfont.woff2') format('woff2'),
                 url('../data/pokemon_solid-webfont.woff') format('woff');
            font-weight: normal;
            font-style: normal;
        }

        h1{       
            font-family: 'pokemon_solidnormal', sans-serif;
            z-index: 5;
        }

        #header-image img {
            padding: 0;
            max-height: 80px;
            height: auto;
            display: inline-block;
            position: absolute;
            bottom: -5px;            
            right: 5px;
            z-index: 0;
        }
    </style>
    
<h1 id="app-title">PokeFinder</h1>
<div id="header-image"></div>
`;


class PKMNHeader extends HTMLElement {
    // constructor called when instance of this class is created
    constructor() {
        super();

        // 1 - Attach a shadow DOM tree to this instance (creates a '.shadowRoot' for us)
        this.attachShadow({ mode: "open" });

        // 2 - Clone 'template' and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // console.log('"this.title = this.shadowRoot.querySelector("#app-title");" = '+this.title);
        // try{
        //     console.log('Trying: "this.title.innerHTML = "POKEFINDER";"');
        //     this.title.innerHTML = "POKEFINDER";
        //     console.log("Code executed successfully");
        // }
        // catch (e){
        //     console.log("Code failed with: "+e.name);
        //     console.log(e);
        // }
        // try{
        //     console.log('Trying: "this.shadowRoot.querySelector("#app-title").innerHTML = "POKEFINDER";"');
        //     this.shadowRoot.querySelector("#app-title").innerHTML = "POKEFINDER";
        //     console.log("Code executed successfully");
        // }
        // catch (e){
        //     console.log("Code failed with: "+e.name);
        //     console.log(e);
        // }

        // If the window is 480px or smaller
        //this.mediaQuery = window.matchMedia('(min-width: 480px)');

    }

    // called when the component is inserted into the DOM
    connectedCallback() {
        this.title = this.shadowRoot.querySelector("#app-title");
        this.header_image = this.shadowRoot.querySelector("#header-image");
        this.className = "is-size-1 px-4 py-3 has-background-info";
        this.render();

        //window.addEventListener("resize", this.render);
    }

    // called when the component is removed from the DOM
    disconnectedCallback() {
        // a good place to clean up, remove event listeners, etc ...
        //window.removeEventListener("resize");
    }

    // a helper method (could be named anything) to display the values of the attributes
    render() {
        // grab the attribute values and assign a default value if necessary
        const src = this.getAttribute('data-src') ? this.getAttribute('data-src') : "../images/questionmark.png";
        const title = this.getAttribute('data-title') ? this.getAttribute('data-title') : "TITLE";

        this.header_image.innerHTML = `<img src="${src}">`;
        this.shadowRoot.querySelector("#app-title").innerHTML = `${title}`;
    }
}

// define our new custom element with `customElements.define()` so that we can use it on the page
customElements.define('pkmn-header', PKMNHeader);