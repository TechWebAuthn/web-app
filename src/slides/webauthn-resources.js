import { html, LitElement, unsafeCSS } from "lit";
import forms from "../styles/forms.css?inline";
import cards from "../styles/cards.css?inline";
import slides from "../styles/slides.css?inline";
import notifications from "../styles/notifications.css?inline";

class WebAuthnResources extends LitElement {
  static get styles() {
    return [unsafeCSS(forms), unsafeCSS(cards), unsafeCSS(notifications), unsafeCSS(slides)];
  }

  render() {
    return html`
      <h1>WebAuthn - Resources</h1>
      <article>
        <aside>
          <figure>
            <img src="/images/webauthn-intro-1.png" alt="WebAuthn Resources" />
            <figcaption>
              <a href="https://www.freepik.com/vectors/infographic">Infographic vector created by vectorjuice</a>
            </figcaption>
          </figure>
        </aside>
        <section>
          <h2>You can use it now</h2>
          <ul>
            <li>🐙 https://github.com/TechWebAuthn</li>
            <li>🐦 https://twitter.com/BogdanArvinte</li>
            <li>🖊️ https://mihaita-tinta.medium.com</li>
          </ul>
          <h2>Learn more</h2>
          <ul>
            <li>🔗 https://webauthn.guide/</li>
            <li>🔗 https://fidoalliance.org/fido2/fido2-web-authentication-webauthn/</li>
            <li>🔗 https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API</li>
            <li>🔗 https://developer.chrome.com/docs/devtools/webauthn/</li>
          </ul>
        </section>
      </article>
    `;
  }
}

customElements.define("presentation-webauthn-resources", WebAuthnResources);
