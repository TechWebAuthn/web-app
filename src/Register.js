import { LitElement, html, unsafeCSS, css } from "lit";
import { clearNotificationMessage, setNotificationMessage } from "./utils/notification";
import "web-authn-components/registration";
import "web-authn-components/recovery";
import "web-authn-components/rtc/enrollment-requester";

import resets from "./styles/resets.css?inline";
import cards from "./styles/cards.css?inline";
import forms from "./styles/forms.css?inline";
import codes from "./styles/codes.css?inline";
import notifications from "./styles/notifications.css?inline";
import headings from "./styles/headings.css?inline";
import details from "./styles/details.css?inline";
import buttons from "./styles/buttons.css?inline";
import layouts from "./styles/layouts.css?inline";
import loaders from "./styles/loaders.css?inline";

class Register extends LitElement {
  constructor() {
    super();

    this._isCurrentFlowComplete = false;
    this._isRegisterFlow = true;
    this._isRecoveryFlow = false;
    this._isAddFlow = false;

    this._onWebAuthnRegisterEvent = this._onRegisterEvent.bind(this);
    this._onWebAuthnRecoverEvent = this._onRecoverEvent.bind(this);
    this._setNotificationMessage = setNotificationMessage.bind(this);

    this.rtcIceServers = [
      { urls: "stun:stun.services.mozilla.com" },
      {
        urls: import.meta.env.VITE_TURN_URL,
        username: import.meta.env.VITE_TURN_USERNAME,
        credential: import.meta.env.VITE_TURN_CREDENTIAL,
      },
    ];
  }

  static get properties() {
    return {
      _isCurrentFlowComplete: Boolean,
      _recoveryToken: String,
      _isRegisterFlow: Boolean,
      _isRecoveryFlow: Boolean,
      _isAddFlow: Boolean,
      _showAddFlowLoader: Boolean,
    };
  }

  static get styles() {
    return [
      unsafeCSS(resets),
      unsafeCSS(cards),
      unsafeCSS(forms),
      unsafeCSS(codes),
      unsafeCSS(notifications),
      unsafeCSS(headings),
      unsafeCSS(details),
      unsafeCSS(buttons),
      unsafeCSS(layouts),
      unsafeCSS(loaders),
      css`
        web-authn-registration::part(input),
        web-authn-recovery::part(input),
        web-authn-rtc-enrollment-requester::part(code) {
          box-sizing: border-box;
        }
      `,
    ];
  }

  firstUpdated() {
    this.shadowRoot
      .querySelectorAll("summary")
      .forEach((summary) => summary.addEventListener("click", this._setFlow.bind(this)));
  }

  render() {
    return html`
      <h2 class="page-subtitle">Register</h2>
      <p id="notification" class="notification"></p>
      <div class="card">
        <details class="details" data-type="register" .open=${this._isRegisterFlow}>
          <summary>Register a new account</summary>
          ${this._isRegisterFlow && !this._isCurrentFlowComplete
            ? html`
                <web-authn-registration
                  class="form"
                  @registration-started="${this._onWebAuthnRegisterEvent}"
                  @registration-created="${this._onWebAuthnRegisterEvent}"
                  @registration-finished="${this._onWebAuthnRegisterEvent}"
                  @registration-error="${this._onWebAuthnRegisterEvent}"
                ></web-authn-registrati>
              `
            : html`
                <p>Your recovery token is:</p>
                <p class="items-row">
                  <code class="code">${this._recoveryToken}</code
                  ><button @click="${this._copyRecoveryTokenToClipboard}" class="icon-button">📋</button>
                </p>
                <p>⚠️ Be sure to save it in a safe and secure place.</p>
              `}
        </details>
        <details class="details" data-type="recover" .open="${this._isRecoveryFlow}">
          <summary>Recover account access</summary>
          ${this._isRecoveryFlow && !this._isCurrentFlowComplete
            ? html`
                <web-authn-recovery
                  class="form"
                  @recovery-started="${this._onRecoverEvent}"
                  @recovery-created="${this._onRecoverEvent}"
                  @recovery-finished="${this._onRecoverEvent}"
                  @recovery-error="${this._onRecoverEvent}"
                ></web-authn-recovery>
              `
            : html`
                <p>Your account has been successfuly recovered on this device!</p>
                <p>Your new recovery token is:</p>
                <p class="items-row">
                  <code class="code">${this._recoveryToken}</code
                  ><button @click="${this._copyRecoveryTokenToClipboard}" class="icon-button">📋</button>
                </p>
                <p>⚠️ Be sure to save it in a safe and secure place.</p>
              `}
        </details>
        <details class="details" data-type="add" .open="${this._isAddFlow}">
          <summary>Add device to existing account</summary>
          ${this._isAddFlow && !this._isCurrentFlowComplete
            ? !this._showAddFlowLoader
              ? html`
                  <web-authn-rtc-enrollment-requester
                    class="form"
                    @enrollment-code-requested="${this._onEnrollmentEvent}"
                    @enrollment-started="${this._onEnrollmentEvent}"
                    @enrollment-created="${this._onEnrollmentEvent}"
                    @enrollment-completed="${this._onEnrollmentEvent}"
                    @enrollment-error="${this._onEnrollmentEvent}"
                    @enrollment-canceled="${this._onEnrollmentEvent}"
                    .rtcIceServers="${this.rtcIceServers}"
                  ></web-authn-rtc-enrollment-requester>
                `
              : html`<div class="center"><progress class="loader" indeterminate></progress></div>`
            : html` <p>Your device has been successfuly added to another account!</p> `}
        </details>
      </div>
    `;
  }

  _setFlow(event) {
    event.preventDefault();

    const details = event.target.closest("details");
    if (details.open) return;

    this._isCurrentFlowComplete = false;
    this._isRegisterFlow = false;
    this._isRecoveryFlow = false;
    this._isAddFlow = false;

    switch (details.dataset.type) {
      case "register":
        this._isRegisterFlow = true;
        break;
      case "recover":
        this._isRecoveryFlow = true;
        break;
      case "add":
        this._isAddFlow = true;
        break;
    }
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
        this._isCurrentFlowComplete = true;
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

  async _onRecoverEvent(event) {
    const { type } = event;
    let message = event.detail?.message;
    let notificationType = "info";

    switch (type) {
      case "recovery-started":
        message = "Starting recovery process";
        break;
      case "recovery-created":
        message = "Validating credentials with server";
        break;
      case "recovery-finished":
        message = "Recovery completed successfuly";
        notificationType = "success";
        this._recoveryToken = event.detail?.recoveryToken;
        this._isCurrentFlowComplete = true;
        break;
      case "recovery-error":
        message = message || "Recovery could not be successfully completed";
        notificationType = "error";
        break;
    }

    this._setNotificationMessage(message, notificationType);
  }

  async _onEnrollmentEvent(event) {
    const { type } = event;
    let message = event.detail?.message;
    let notificationType = "info";

    switch (type) {
      case "enrollment-code-requested":
        message = "Generating enrollment code";
        clearNotificationMessage(this.shadowRoot.querySelector("#notification"));
        break;
      case "enrollment-started":
        message = "Starting enrollment process";
        this._showAddFlowLoader = true;
        break;
      case "enrollment-created":
        message = "Validating credentials with server";
        break;
      case "enrollment-completed":
        message = "Enrollment completed successfuly";
        notificationType = "success";
        this._isCurrentFlowComplete = true;
        this._showAddFlowLoader = false;
        break;
      case "enrollment-canceled":
        message = message || "Enrollment has been canceled";
        notificationType = "error";
        break;
      case "enrollment-error":
        message = message || "Enrollment could not be successfully completed";
        notificationType = "error";
        break;
    }

    this._setNotificationMessage(message, notificationType);
  }

  async _copyRecoveryTokenToClipboard() {
    await navigator.clipboard.writeText(this._recoveryToken);
    this._setNotificationMessage("Recovery token copied to clipboard", "info");
  }
}

customElements.define("auth-register", Register);
