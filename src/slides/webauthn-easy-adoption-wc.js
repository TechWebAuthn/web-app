import { html, unsafeCSS, css } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import "../components/gist";
import layouts from "../styles/layouts.css?inline";
import slides from "../styles/slides.css?inline";

class WebAuthnEasyAdoptionWC extends PresentationPageTemplate {
  static get styles() {
    return [
      unsafeCSS(layouts),
      unsafeCSS(slides),
      css`
        article {
          margin-block-end: 6rem;
        }
      `,
    ];
  }

  render() {
    return html`
      <h1>WebAuthn - Easy adoption with Web Components</h1>

      <article>
        <section class="column">
          <auth-gist data-gist-id="53b9e82b723ac923117f155d38f1b604" data-multi-file></auth-gist>
        </section>
        <section class="column">
          <auth-gist data-gist-id="12c1f1367bbb2a4b2894e5c24e8da8aa" data-multi-file></auth-gist>
        </section>
        <section class="column">
          <auth-gist data-gist-id="d60e0778a9e9c92e4fe2e57393cae226"></auth-gist>
        </section>
      </article>
    `;
  }

  get _prompterMessage() {
    return `
      # WebAuthn - Easy adoption with Web Components
      -
    `;
  }
}

customElements.define("presentation-webauthn-easy-adoption-wc", WebAuthnEasyAdoptionWC);
