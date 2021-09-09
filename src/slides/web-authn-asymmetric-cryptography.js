import { css, html, unsafeCSS } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import { setNotificationMessage } from "../utils/notification";
import "webauthn-components/recovery";
import forms from "../styles/forms.css?inline";
import cards from "../styles/cards.css?inline";
import notifications from "../styles/notifications.css?inline";
import layouts from "../styles/layouts.css?inline";
import slides from "../styles/slides.css?inline";

class WebAuthnAsymmetricCryptography extends PresentationPageTemplate {
  constructor() {
    super();

    this._setNotificationMessage = setNotificationMessage.bind(this);
  }

  static get styles() {
    return [
      unsafeCSS(forms),
      unsafeCSS(cards),
      unsafeCSS(notifications),
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
      <h1>WebAuthn - Asymmetric cryptography</h1>

      <article>
        <aside class="wide">
          <figure>
            <img src="/images/asymmetric-signing-diagram.png" alt="Asymmetric signing diagram" />
            <!--                        TODO draw it -->
          </figure>
        </aside>
        <section>
          <h3>Terms</h3>
          <ul>
            <li>Public Key - anybody can have it</li>
            <li>Private Key - never leaves the device</li>
            <li>Message - data being sent</li>
            <li>Encryption = Message + Public/Private Key</li>
          </ul>
          <h3>Properties</h3>
          <ul>
            <li>Message + Public Key - secured transmission</li>
            <li>Message + Private Key - guarantees identity of the sender</li>
          </ul>
        </section>
      </article>
    `;
  }

  get _prompterMessage() {
    return `
      # Web Authn - Asymmetric cryptography
      Before we go any further, we have to align on what public key based credentials are.
In asymmetric cryptography, we have the public key/private key pair. While anybody can use the public key, the access to the private key should be controlled.
Based on this restriction if we encrypt the message with a public key, we get a secured transmission because only one having the private key can see the original message.
If we encrypt the message with the private key, anybody can see the original message. This is still useful because only one having the private key can create that valid message.
So everybody can validate the message was actually signed by the one having the private key. In this way we validate the identity of the sender and this is the main cryptography principle used in webauthn.

Because the private key never leaves the authenticator, we are sure the message was signed by the right user.
So we are using strong credentials instead of a password.
    `;
  }
}

customElements.define("presentation-web-authn-asymmetric-cryptography", WebAuthnAsymmetricCryptography);
