import { css, html, unsafeCSS } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html";
import PresentationPageTemplate from "./presentation-page-template";
import slides from "../styles/slides.css?inline";
import { setNotificationMessage } from "../utils/notification";
import "web-authn-components/recovery";
import forms from "../styles/forms.css";
import cards from "../styles/cards.css";
import notifications from "../styles/notifications.css";

import svgFile from "../../public/images/web-authn-actors.svg?raw";

class WebAuthnIntroduction extends PresentationPageTemplate {
  constructor() {
    super();

    this._setNotificationMessage = setNotificationMessage.bind(this);
  }

  static get styles() {
    return [
      unsafeCSS(forms),
      unsafeCSS(cards),
      unsafeCSS(notifications),
      unsafeCSS(slides),
      css`
        web-authn-recovery::part(input) {
          box-sizing: border-box;
        }
      `,
    ];
  }

  render() {
    return html`
      <h1>Web Authn - Introduction</h1>

      <article>
        <aside>
          <figure>
            <img src="/images/webauthn-intro-1.png" alt="WebAuthn Introduction" />
            <figcaption>
              <a href="https://www.freepik.com/vectors/technology"
                >Technology vector created by stories - www.freepik.com</a
              >
            </figcaption>
          </figure>
        </aside>
        <section>
          <blockquote>
            A new standard enabling the creation and use of strong, attested, scoped, public key-based credentials by
            web apps
          </blockquote>
          ${unsafeHTML(svgFile)}
        </section>
      </article>
    `;
  }

  get _prompterMessage() {
    return `
      # Web Authn - Introduction
    `;
  }
}

customElements.define("presentation-web-authn-introduction", WebAuthnIntroduction);
