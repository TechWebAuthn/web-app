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
}

customElements.define("presentation-webauthn-add-new-options", WebAuthnAddNewOptions);
