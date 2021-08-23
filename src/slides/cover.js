import { LitElement, html, unsafeCSS } from "lit";
import slides from "../styles/slides.css?inline";

class Cover extends LitElement {
  static get styles() {
    return [unsafeCSS(slides)];
  }

  render() {
    return html`
      <article class="cover-title">
        <h1>Going password-less with Web Authentication</h1>
        <h2>Mihaita Tinta & Bogdan Arvinte</h2>
        <section>
          <h3>Cluj, September 20th, 2021</h3>
        </section>
      </article>
    `;
  }
}

customElements.define("presentation-cover", Cover);
