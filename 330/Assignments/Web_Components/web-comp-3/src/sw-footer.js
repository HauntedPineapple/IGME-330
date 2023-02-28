const template = document.createElement("template");
template.innerHTML = `
<style>
  footer{
    color: white;
    background-color: black;
    padding: .5rem;
    margin-top: .5rem;
  }
</style>
<footer>
<span></span>
</footer>
`;

class SWFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.render();
  }


  render() {
    const year = this.getAttribute('data-year') ? this.getAttribute('data-year') : "0000";
    const title = this.getAttribute('data-title') ? this.getAttribute('data-title') : "Nobody";
    
    this.shadowRoot.querySelector("span").innerHTML = `&copy ${year} ${title}`;
  }
}

customElements.define('sw-footer', SWFooter);