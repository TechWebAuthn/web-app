import { css, html, unsafeCSS } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import { setNotificationMessage } from "../utils/notification";
import "webauthn-components/registration";
import "../components/logs";
import forms from "../styles/forms.css?inline";
import cards from "../styles/cards.css?inline";
import notifications from "../styles/notifications.css?inline";
import layouts from "../styles/layouts.css?inline";
import codes from "../styles/codes.css?inline";
import buttons from "../styles/buttons.css?inline";
import slides from "../styles/slides.css?inline";

class WebAuthnRegister extends PresentationPageTemplate {
  constructor() {
    super();

    this._setNotificationMessage = setNotificationMessage.bind(this);
    this._onWebAuthnRegisterEvent = this._onRegisterEvent.bind(this);
    this._isRegisterComplete = false;
  }

  static get properties() {
    return {
      _isRegisterComplete: Boolean,
      _recoveryToken: String,
    };
  }

  static get styles() {
    return [
      unsafeCSS(forms),
      unsafeCSS(cards),
      unsafeCSS(notifications),
      unsafeCSS(layouts),
      unsafeCSS(codes),
      unsafeCSS(buttons),
      unsafeCSS(slides),
      css`
        webauthn-registration::part(input) {
          box-sizing: border-box;
        }
      `,
    ];
  }

  render() {
    return html`
      <h1>Web Authn - Register</h1>

      <article>
        <aside class="fit-content">
          <output class="device">
            <h2>Register</h2>
            <p id="notification" class="notification"></p>
            <div class="card">
              ${!this._isRegisterComplete
                ? html`
                    <webauthn-registration
                      class="form"
                      @registration-started="${this._onWebAuthnRegisterEvent}"
                      @registration-created="${this._onWebAuthnRegisterEvent}"
                      @registration-finished="${this._onWebAuthnRegisterEvent}"
                      @registration-error="${this._onWebAuthnRegisterEvent}"
                    ></web-authn-registration>
                  `
                : html`
                    <p>Your recovery token is:</p>
                    <p class="items-row">
                      <code class="code">${this._recoveryToken}</code
                      ><button @click="${this._copyRecoveryTokenToClipboard}" class="icon-button">📋</button>
                    </p>
                    <p>⚠️ Be sure to save it in a safe and secure place.</p>
                  `}
            </div>
          </output>
        </aside>
        <section class="column">
          <auth-logs></auth-logs>
        </section>
        <section class="column">
          <figure>
            <img src="/images/webauthn-register.png" alt="WebAuthn Register" />
            <figcaption>
              <a href="https://www.freepik.com/vectors/technology">Technology vector created by stories</a>
            </figcaption>
          </figure>
        </section>
      </article>
    `;
  }

  async _onRegisterEvent(event) {
    const { type } = event;
    let message = event.detail?.message;
    let notificationType = "info";

    switch (type) {
      case "registration-started":
        message = "Starting registration process";
        break;
      case "registration-created":
        message = "Validating credentials with server";
        break;
      case "registration-finished":
        message = "Registration completed successfuly";
        notificationType = "success";
        this._recoveryToken = event.detail?.recoveryToken;
        this._isRegisterComplete = true;
        break;
      case "registration-error":
        if (message === "USERNAME_TAKEN") {
          message = "Username is already taken";
        } else {
          message = "Registration could not be successfully completed";
        }
        notificationType = "error";
        break;
    }

    this._setNotificationMessage(message, notificationType);
  }

  async _copyRecoveryTokenToClipboard() {
    await navigator.clipboard.writeText(this._recoveryToken);
    this._setNotificationMessage("Recovery token copied to clipboard", "info");
  }

  get _prompterMessage() {
    return `
      # Web Authn - Register
      - in this page you are seeing on the left hand side, a browser app accessing the account registration page.
We can type any username here to create an account. This may represent an email address or not. Just to have fun, we will use something else (EMOJIIIII)
In the log panel, we can see a stream of events with all the logs coming from our RP.
There are 3 steps involved:
- the user provides the username (and that's an optional field in webauthn)
- the browser asks the RP to create an account for that username. In response, the RP sends its information
like rpId, origin, user info and a challenge. This data is being used by the authenticator to create a new set of credentials.
From our previous slide, we said that a message encrypted with a private key guarantees the identity of the sender.
Here that message represents the challenge and its value it's something with zero meaning.
- the user has to assert their presence to the authenticator
- the final step here is for the browser to sends the signed challenge coming from the authenticator to the RP and the public key based credential for future references

The authenticator will scope the credentials to this RP based on this info.
This means that the authenticator limits access for RPs to the credentials created for them.
Additionally everytime the RP receives a signed challenge it also validates the challenge was created from a whitelisted origin.
With this mechanism in place, a phishing attack won't work even the user doesn't notice he is being scammed
    `;
  }
}

customElements.define("presentation-web-authn-register", WebAuthnRegister);
