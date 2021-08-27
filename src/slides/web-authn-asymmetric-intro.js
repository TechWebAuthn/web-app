import { css, html, LitElement, unsafeCSS } from "lit";
import slides from "../styles/slides.css?inline";
import { setNotificationMessage } from "../utils/notification";
import "web-authn-components/recovery";
import forms from "../styles/forms.css?inline";
import cards from "../styles/cards.css?inline";
import notifications from "../styles/notifications.css?inline";
import layouts from "../styles/layouts.css?inline";

class WebAuthnAsymmetricIntro extends LitElement {
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
        web-authn-recovery::part(input) {
          box-sizing: border-box;
        }
      `,
    ];
  }

  render() {
    return html`
      <h1>Web Authn - Asymmetric cryptography</h1>

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
}

customElements.define("presentation-web-authn-asymmetric-intro", WebAuthnAsymmetricIntro);
