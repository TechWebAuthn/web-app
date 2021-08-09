import { LitElement, html, unsafeCSS, css } from "lit";
import { decodePublicKeyCredentialCreateOptions, encodeRegisterCredential } from "./utils/parse";
import { clearNotificationMessage, setNotificationMessage } from "./utils/notification";
import { request } from "./utils/network";
import { WebRTCConnection, WebSocketConnection } from "./utils/webrtc";
import "./components/web-authn-register";
import "./components/web-authn-recover";
import "./components/web-authn-enroll";

import resets from "./styles/resets.css";
import cards from "./styles/cards.css";
import forms from "./styles/forms.css";
import codes from "./styles/codes.css";
import notifications from "./styles/notifications.css";
import headings from "./styles/headings.css";
import details from "./styles/details.css";
import buttons from "./styles/buttons.css";
import layouts from "./styles/layouts.css";
import loaders from "./styles/loaders.css";

class Register extends LitElement {
  constructor() {
    super();

    this._isCurrentFlowComplete = false;
    this._isRegisterFlow = true;
    this._isRecoveryFlow = false;
    this._isAddFlow = false;

    this.RTC = null;

    this._onWebAuthnRegisterEvent = this._onRegisterEvent.bind(this);
    this._onWebAuthnRecoverEvent = this._onRecoverEvent.bind(this);
    this._setNotificationMessage = setNotificationMessage.bind(this);
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
        web-authn-register::part(input),
        web-authn-recover::part(input),
        web-authn-enroll::part(code) {
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
                <web-authn-register
                  class="form"
                  @registration-start="${this._onWebAuthnRegisterEvent}"
                  @registration-respond="${this._onWebAuthnRegisterEvent}"
                  @registration-finished="${this._onWebAuthnRegisterEvent}"
                  @registration-error="${this._onWebAuthnRegisterEvent}"
                ></web-authn-register>
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
                <web-authn-recover
                  class="form"
                  @recovery-start="${this._onRecoverEvent}"
                  @recovery-respond="${this._onRecoverEvent}"
                  @recovery-finished="${this._onRecoverEvent}"
                  @recovery-error="${this._onRecoverEvent}"
                ></web-authn-recover>
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
                  <web-authn-enroll
                    class="form"
                    @enrollment-code-requested="${this._onEnrollmentEvent}"
                    @enrollment-agreement-accepted="${this._onEnrollmentEvent}"
                    @enrollment-start="${this._onEnrollmentEvent}"
                    @enrollment-respond="${this._onEnrollmentEvent}"
                    @enrollment-finished="${this._onEnrollmentEvent}"
                    @enrollment-error="${this._onEnrollmentEvent}"
                    @enrollment-canceled="${this._onEnrollmentEvent}"
                  ></web-authn-enroll>
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
      case "registration-start":
        message = "Starting registration process";
        break;
      case "registration-respond":
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
      case "recovery-start":
        message = "Starting recovery process";
        break;
      case "recovery-respond":
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
        this._startExternalConnection();
        break;
      case "enrollment-agreement-accepted":
        this._requestRegistrationAddToken();
        break;
      case "enrollment-start":
        message = "Starting enrollment process";
        this._showAddFlowLoader = true;
        break;
      case "enrollment-respond":
        message = "Validating credentials with server";
        break;
      case "enrollment-finished":
        message = "Enrollment completed successfuly";
        notificationType = "success";
        this._isCurrentFlowComplete = true;
        this.RTC.dataChannel.send("event::complete");
        this._showAddFlowLoader = false;
        break;
      case "enrollment-canceled":
        message = message || "Enrollment has been canceled";
        notificationType = "error";
        this._cancelEnrollmentFlow();
        break;
      case "enrollment-error":
        message = message || "Enrollment could not be successfully completed";
        notificationType = "error";
        this._cancelEnrollmentFlow();
        break;
    }

    this._setNotificationMessage(message, notificationType);
  }

  async _copyRecoveryTokenToClipboard() {
    await navigator.clipboard.writeText(this._recoveryToken);
    this._setNotificationMessage("Recovery token copied to clipboard", "info");
  }

  _startExternalConnection() {
    this.RTC?.close();
    clearNotificationMessage();
    const enrollmentComponent = this.shadowRoot.querySelector("web-authn-enroll");

    this.RTC = new WebRTCConnection(new WebSocketConnection("/api/socket"));
    this.RTC.createDataChannel();
    this.RTC.oncode = (code) => {
      enrollmentComponent.peerCode = code;
    };
    this.RTC.onuser = async (user) => {
      await this.RTC.createOffer();
      this._setNotificationMessage(`User ${user} wants to claim this device`, "info", false);
      enrollmentComponent.agreementText = `I understand that this device will be added to ${user}'s account`;
      enrollmentComponent.dispatchEvent(new CustomEvent("enrollment-code-confirmed"));
    };
  }

  _requestRegistrationAddToken() {
    const enrollmentComponent = this.shadowRoot.querySelector("web-authn-enroll");

    this.RTC.sendData("action::add");
    this.RTC.ondatachannelmessage = (event) => {
      const [type, data] = event.data.split("::");

      if (type === "token") {
        enrollmentComponent.registrationAddToken = data;
      }
    };
    this.RTC.listenForData();
  }

  _cancelEnrollmentFlow() {
    this.RTC.sendData("action::cancel");
    this.RTC?.close();
  }
}

customElements.define("auth-register", Register);
