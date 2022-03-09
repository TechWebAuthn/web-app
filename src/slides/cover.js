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
        <h1>Going passwordless with Web Authentication</h1>
        <h2>Mihăiță (Miță) Țintă & Bogdan (mArv) Arvinte</h2>
        <section>
          <h3>Bucharest, March 25, 2022</h3>
        </section>
      </article>
      <section class="cover-avatars">
        <figure>
          <img src="/images/mihaita.tinta.jpg" alt="Mihăiță Țintă" />
          <figcaption>Miță</figcaption>
        </figure>
        <figure>
          <img src="/images/bogdan.arvinte.jpg" alt="Bogdan Arvinte" />
          <figcaption>mArv</figcaption>
        </figure>
      </section>
    `;
  }

  get _prompterMessage() {
    return `
      # Going passwordless with Web Authentication

      Welcome everyone! [Introduce ourselves]

      Today we're going to discuss Web Authentication and share with you some of the things we've learned in the pursuit of a passwordless web.

      Before we dive right in, let's have a look at the topics that we'll go through today.
    `;
  }
}

customElements.define("presentation-cover", Cover);
