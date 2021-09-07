import { css, html, unsafeCSS } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import PresentationPageTemplate from "./presentation-page-template";
import slides from "../styles/slides.css?inline";
import { setNotificationMessage } from "../utils/notification";
import "webauthn-components/recovery";
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
        webauthn-recovery::part(input) {
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
              <a href="https://www.freepik.com/vectors/technology">Technology vector created by stories</a>
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
      #WebAuthentication intro
      WebAuthentication is a specification which enables passwordless authentication by using strong, attested and scoped public key based credentials by web applications.

It was developed by the W3C and the Fido Alliance and their ambition was to create a more secured process around authentication.
You will hear during the next slides some new terms like:
- Relying Party - the web application you are building. This is like: https://mycluj.e-primariaclujnapoca.ro/
- Authenticator is a device/software used by the Browser to create and access public key based credentials. The browser uses the WebAuthentication API - an extension to the Credential Management API to communicate with it.
Authenticators come in different forms: platform authenticators - built into the computer/phone or roaming authenticators - external keys - your machine connects to a remote device.

So, until now, the end users had to remember a password - a shared secret.
Right now, they need access to an authenticator that uses asymmetric cryptography.
    `;
  }
}

customElements.define("presentation-web-authn-introduction", WebAuthnIntroduction);
