const template = document.createElement("template");
template.innerHTML = `
<style></style>
<footer class="footer pt-0 pb-0">
  <div class="content has-text-left">
    <p>
      <strong id="title-element">Bulma</strong> by <a href="https://www.rit.edu">Ace Coder</a>. The source code is licensed
      <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website content
      is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY NC SA 4.0</a>.
    </p>
  </div>
</footer>
`;

class HotdogFooter extends HTMLElement{
    constructor(){}

    connectedCallback(){}

    attributeChangedCallback(attributeName, oldVal, newVal){}

    static get observedAttributes(){}

    render(){}
}

customElements.define('hotdog-footer', HotdogFooter);