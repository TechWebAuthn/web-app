import { css, html, unsafeCSS } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import PresentationPageTemplate from "./presentation-page-template";
import "webauthn-components/recovery";
import layouts from "../styles/layouts.css?inline";
import slides from "../styles/slides.css?inline";
import cards from "../styles/cards.css?inline";

import passwordSVG from "../../public/images/password-login.svg?raw";
import webauthnSVG from "../../public/images/webauthn-login.svg?raw";

class WebAuthnPhishingUseCase extends PresentationPageTemplate {
  static get styles() {
    return [
      unsafeCSS(slides),
      unsafeCSS(cards),
      unsafeCSS(layouts),
      css`
        webauthn-recovery::part(input) {
          box-sizing: border-box;
        }

        figcaption {
          margin-block-start: 1em;
          font-size: 1.5em;
        }

        .card {
          max-width: 100%;
          margin: 0;
          box-sizing: border-box;
        }

        figure {
          max-width: 100%;
        }

        section.fullscreen {
          align-items: center;
          justify-content: center;
        }

        section.fullscreen figure {
          height: 80vh;
          aspect-ratio: 2;
          font-size: 1.5rem;
        }

        svg {
          flex: 1;
          aspect-ratio: 2;
        }
      `,
    ];
  }

  render() {
    return html`
      <h1>WebAuthn - Phishing use case</h1>

      <article>
        <section class="column card expandable">
          <button @click="${this._toggleFullscreen}" class="expand">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M24 9h-4v-5h-5v-4h9v9zm-9 15v-4h5v-5h4v9h-9zm-15-9h4v5h5v4h-9v-9zm9-15v4h-5v5h-4v-9h9z" />
            </svg>
          </button>
          <figure>
            ${unsafeHTML(passwordSVG)}
            <figcaption>Login with password</figcaption>
          </figure>
        </section>
        <section class="column card expandable">
          <button @click="${this._toggleFullscreen}" class="expand">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M24 9h-4v-5h-5v-4h9v9zm-9 15v-4h5v-5h4v9h-9zm-15-9h4v5h5v4h-9v-9zm9-15v4h-5v5h-4v-9h9z" />
            </svg>
          </button>
          <figure>
            ${unsafeHTML(webauthnSVG)}
            <figcaption>Login with Web Authentication</figcaption>
          </figure>
        </section>
      </article>
    `;
  }

  _toggleFullscreen(event) {
    const expandable = event.target.closest(".expandable");
    expandable.classList.toggle("fullscreen");
  }

  get _prompterMessage() {
    return `
      # WebAuthn - Phishing use case

      Password login vulnerability to phishing.

      WebAuthn protects against phising attacks.
    `;
  }
}

customElements.define("presentation-webauthn-phishing-use-case", WebAuthnPhishingUseCase);
