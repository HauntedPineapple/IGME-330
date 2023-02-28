const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<style>
    .navbar{
        background-color: #1889cb;
        user-select: none;
    }

    .navbar a,  .navbar b{
        color: black;
    }
</style>

<nav class="navbar">
    <div class="navbar-brand">
        <img class="navbar-item" src="./data/images/music.png" alt="site logo" style="max-height:55px">
        <a class="navbar-burger" id="burger">
            <span></span>
            <span></span>
            <span></span>
        </a>
    </div>

    <div class="navbar-menu" id="nav-menu">
    <div id="nav-links" class="navbar-end">
        </div>
    </div>
</nav>
`;

// Create a class and extend HTMLElement
class CustomNavbar extends HTMLElement {
    // constructor called when instance of this class is created
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

    // called when the component is inserted into the DOM
    connectedCallback() {
        // draw page
        this.render();
        // hookup event listener
        this.burgerIcon.addEventListener("click", () => {
            this.navbarMenu.classList.toggle("is-active");
        });
    }

    // called when the component is removed from the DOM
    disconnectedCallback() {
        this.burgerIcon.removeEventListener("click"); // remove event listener
    }

    // this lifecycle method is invoked each time one of the component's "watched" attributes changes
    attributeChangedCallback(attributeName, oldVal, newVal) {
        console.log(attributeName, oldVal, newVal);
        this.render();
    }

    // a helper method (could be named anything) to display the values of the attributes
    render() {
        // update the DOM in some way based on the value of the attributes
        let logo = this.getAttribute('data-logo') ? this.getAttribute('data-logo') : "./data/images/music.png";
        this.shadowRoot.querySelector("img").setAttribute("src", logo);

        let navbarHTML = "";
        for (let i = 1; i < 4; i++) {
            let linkName = this.getAttribute(`data-link${i}-name`);
            let linkURL = this.getAttribute(`data-link${i}-url`);
            if (linkName) {
                if (linkURL) { // Create a link
                    navbarHTML += `<a class="navbar-item is-hoverable nav-link" href="${linkURL}">${linkName}</a>`;
                }
                else { // We assume this is the page we are on, so we don't make a link
                    navbarHTML += `<b class="navbar-item">${linkName}</b>`;
                }
            }
        }
        this.shadowRoot.querySelector("#nav-links").innerHTML = navbarHTML;
    }

} // end class

// define our new custom element with `customElements.define()` so that we can use it on the page
customElements.define('custom-navbar', CustomNavbar);