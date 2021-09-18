import { html, unsafeCSS, css } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import "../components/gist";
import layouts from "../styles/layouts.css?inline";
import slides from "../styles/slides.css?inline";

class WebAuthnRPInitialSteps extends PresentationPageTemplate {
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
      <h1>WebAuthn - Relying Party initial steps</h1>

      <article>
        <section class="column">
          <auth-gist data-gist-id="8eac08de0bde4ebefc6f65877000065a"></auth-gist>
        </section>
        <section class="column">
          <auth-gist data-gist-id="a3b0280dbd5ffd12340584903d193441"></auth-gist>
        </section>
        <section class="column">
          <auth-gist data-gist-id="92aa7a150376855427de875ad772d3ab"></auth-gist>
        </section>
      </article>
    `;
  }

  get _prompterMessage() {
    return `
      # WebAuthn - Relying Party initial steps
      -
    `;
  }
}

customElements.define("presentation-webauthn-rp-initial-steps", WebAuthnRPInitialSteps);
