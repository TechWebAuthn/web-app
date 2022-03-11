import { html, unsafeCSS } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import forms from "../styles/forms.css?inline";
import cards from "../styles/cards.css?inline";
import slides from "../styles/slides.css?inline";
import notifications from "../styles/notifications.css?inline";

class WebAuthnAddNewOptions extends PresentationPageTemplate {
  static get styles() {
    return [unsafeCSS(forms), unsafeCSS(cards), unsafeCSS(notifications), unsafeCSS(slides)];
  }

  render() {
    return html`
      <h1>WebAuthn - Options to add a new device</h1>
      <article>
        <section>
          <figure data-reveal>
            <img src="/images/webauthn-add-device-opt0.png" alt="WebAuthn - Add new device W3C" />
            <figcaption>
              <a href="https://www.flaticon.com/">Icons from flaticon.com</a>
            </figcaption>
          </figure>
        </section>
        <section>
          <figure data-reveal>
            <img src="/images/webauthn-add-device-opt1.png" alt="WebAuthn - Add new device manually" />
            <figcaption>
              <a href="https://www.flaticon.com/">Icons from flaticon.com</a>
            </figcaption>
          </figure>
        </section>
        <section>
          <figure data-reveal>
            <img src="/images/webauthn-add-device-opt2.png" alt="WebAuthn - Add new device with WebSockets" />
            <figcaption>
              <a href="https://www.flaticon.com/">Icons from flaticon.com</a>
            </figcaption>
          </figure>
        </section>
        <section>
          <figure data-reveal>
            <img src="/images/webauthn-add-device-opt3.png" alt="WebAuthn - Add new device with WebRTC" />
            <figcaption>
              <a href="https://www.flaticon.com/">Icons from flaticon.com</a>
            </figcaption>
          </figure>
        </section>
      </article>
    `;
  }

  get _prompterMessage() {
    return `
      # WebAuthn - Options to add a new device

      There are several options available for adding a new device:

      1. Use a roaming authenticator to access your account from another device.
      2. Send a token through an external channel (e.g. type it, email, WhatsApp, etc.).
      3. Send a token through a WebSocket connection between the two devices.
      4. Send a token through WebRTC (peer-to-peer) between the two devices (use WebSockets for discovery).

      We'll explore the last one as it relieves the server of an open connection and provides secure peer-to-peer communication.
    `;
  }
}

customElements.define("presentation-webauthn-add-new-options", WebAuthnAddNewOptions);
