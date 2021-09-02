import { css, html, unsafeCSS } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import { setNotificationMessage } from "../utils/notification";
import "web-authn-components/registration";
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
        web-authn-registration::part(input) {
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
                    <web-authn-registration
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

  get _prompterMessage() {
    return `
      # Web Authn - Register
    `;
  }
}

customElements.define("presentation-web-authn-register", WebAuthnRegister);
