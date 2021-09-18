import { html, unsafeCSS, css } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import slides from "../styles/slides.css?inline";

class AuthenticationHow extends PresentationPageTemplate {
  static get styles() {
    return [
      unsafeCSS(slides),
      css`
        ul {
          display: inline-grid;
        }
        li {
          display: grid;
          gap: 2em;
          grid-template-columns: 0 1fr 1fr;
        }
        li::before {
          content: "🔐";
        }
      `,
    ];
  }

  render() {
    return html`
      <h1>Authentication - How does it work?</h1>

      <article>
        <aside>
          <figure>
            <img src="/images/authentication-how.png" alt="Authentication method" />
            <figcaption>
              <a href="https://www.freepik.com/vectors/computer">Computer vector created by stories</a>
            </figcaption>
          </figure>
        </aside>
        <section>
          <h2>Some factors of authentication</h2>
          <ul>
            <li>Something you know <span>passwords</span></li>
            <li>Something you have <span>TOTP, RSA SecureID</span></li>
            <li>Something you are <span>face, fingerprint, voice</span></li>
            <li>Somewhere you are <span>geolocation</span></li>
            <li>Something you do <span>personal patterns</span></li>
          </ul>
        </section>
        <!-- <section>
          <h2>Some common types of authentication</h2>
          <ul>
            <li>Password-based</li>
            <li>Multi-factor</li>
            <li>Certificate-based</li>
            <li>Biometric</li>
            <li>Token-based</li>
          </ul>
        </section> -->
      </article>
    `;
  }

  get _prompterMessage() {
    return `
      # Authentication - How does it work?

      There are many ways to implement authentication, and all require at least one authentication factor.

      Authentication factors are a particular category of security credentials used to verify the identity of a user.

      - Something you know: passwords (typical example)
      - Something you have: TOTP, smart card, physical token
      - Something you are: biometrics (face, fingerprint)
      - Somewhere you are: geolocation (geofencing)
      - Something you do: behavior, personal patterns
    `;
  }
}

customElements.define("presentation-authentication-how", AuthenticationHow);
