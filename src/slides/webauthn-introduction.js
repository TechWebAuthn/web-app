import { css, html, unsafeCSS } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import PresentationPageTemplate from "./presentation-page-template";
import "webauthn-components/recovery";
import layouts from "../styles/layouts.css?inline";
import slides from "../styles/slides.css?inline";

import svgFile from "../../public/images/webauthn-actors.svg?raw";

class WebAuthnIntroduction extends PresentationPageTemplate {
  static get styles() {
    return [
      unsafeCSS(layouts),
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
      <h1>WebAuthn - Introduction</h1>

      <article>
        <aside>
          <figure>
            <img src="/images/webauthn-intro-1.png" alt="WebAuthn Introduction" />
            <figcaption>
              <a href="https://www.freepik.com/vectors/technology">Technology vector created by stories</a>
            </figcaption>
          </figure>
        </aside>
        <section class="column">
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
      # WebAuthn - Introduction

      WebAuthentication is a specification which enables passwordless authentication by using strong, attested and scoped public key based credentials by web applications.

      It was developed by the W3C and the Fido Alliance and their ambition was to create a more secured process around authentication.
      You will hear during the next slides some new terms like:

      - Relying Party - the web application you are building.
      - Authenticator is a device/software used by the Browser to create and access public key based credentials. The browser uses the WebAuthentication API - an extension to the Credential Management API to communicate with it.

      Authenticators come in different forms: platform authenticators - built into the computer/phone or roaming authenticators - external keys - your machine connects to a remote device.

      So, until now, the end users had to remember a password - a shared secret.
      Right now, they need access to an authenticator that uses asymmetric cryptography.
    `;
  }
}

customElements.define("presentation-webauthn-introduction", WebAuthnIntroduction);
