import { html, unsafeCSS, css } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import layouts from "../styles/layouts.css?inline";
import slides from "../styles/slides.css?inline";

class WebAuthnCeremonies extends PresentationPageTemplate {
  static get styles() {
    return [
      unsafeCSS(layouts),
      unsafeCSS(slides),
      css`
        section {
          font-size: 1.25em;
        }
      `,
    ];
  }

  render() {
    return html`
      <h1>WebAuthn - Ceremonies</h1>

      <article>
        <section>
          <ul class="image-grid">
            <li>
              <h2>Register</h2>
              <figure>
                <img src="/images/webauthn-register.png" alt="WebAuthn Register" />
                <figcaption>
                  <a href="https://www.freepik.com/vectors/technology">Technology vector created by stories</a>
                </figcaption>
              </figure>
            </li>
            <li>
              <h2>Login</h2>
              <figure>
                <img src="/images/webauthn-login.png" alt="WebAuthn Login" />
                <figcaption>
                  <a href="https://www.freepik.com/vectors/sign">Sign vector created by stories</a>
                </figcaption>
              </figure>
            </li>
            <li>
              <h2>Recovery</h2>
              <figure>
                <img src="/images/webauthn-recover.png" alt="WebAuthn Recovery" />
                <figcaption>
                  <a href="https://www.freepik.com/vectors/website">Website vector created by stories</a>
                </figcaption>
              </figure>
            </li>
            <li>
              <h2>Add new device</h2>
              <figure>
                <img src="/images/webauthn-enroll.png" alt="WebAuthn Enroll" />
                <figcaption>
                  <a href="https://www.freepik.com/vectors/user">User vector created by stories</a>
                </figcaption>
              </figure>
            </li>
          </ul>
        </section>
        <section>
          <h2>Register</h2>
          <p>Creating an account on the relying party using your device.</p>
          <h2>Login</h2>
          <p>Using a registered device to log onto the relying party.</p>
          <h2>Recovery</h2>
          <p>Obtaining access to your account after losing the device.</p>
          <h2>Add new device</h2>
          <p>Enrolling a new device to your existing account.</p>
        </section>
      </article>
    `;
  }

  get _prompterMessage() {
    return `
      # Web Authn - Ceremonies
      WebAuthentication defines several ceremonies to allow creation and usage of the public key based credentials.
The registration ceremony allows the RP to link a new set of credentials to a possibly new user account
The login ceremony represents the actual authentication process to validate the user identity
To prevent an account lock out the user can use a recovery key.

And finally we are adding a device enrollment process with different variations to enhance the current WebAuthentication proposal and make it easier for the end user to add more devices to his account.
    `;
  }
}

customElements.define("presentation-webauthn-ceremonies", WebAuthnCeremonies);
