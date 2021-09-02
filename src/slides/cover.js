import { html, unsafeCSS } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import slides from "../styles/slides.css?inline";

class Cover extends PresentationPageTemplate {
  static get styles() {
    return [unsafeCSS(slides)];
  }

  render() {
    return html`
      <article class="cover-title">
        <h1>Going password-less with Web Authentication</h1>
        <h2>Mihăiță (Miță) Tinta & Bogdan (mArv) Arvinte</h2>
        <section>
          <h3>Cluj, September 20th, 2021</h3>
        </section>
      </article>
    `;
  }

  get _prompterMessage() {
    return `
      # Going password-less with Web Authentication

      Miță and mArv introduction

      Opening statement about the presentation
    `;
  }
}

customElements.define("presentation-cover", Cover);
