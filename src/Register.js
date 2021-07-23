import { LitElement, html } from "lit";
import {
  card,
  form,
  code,
  notification,
  iconButton,
  itemsRow,
  pageSubtitle,
  details,
} from "../public/css/component.module.css";
import { base64UrlStringToUint8Array, parseRegisterCredential } from "./utils/parse";
import { clearNotificationMessage, setNotificationMessage } from "./utils/notification";
import { request } from "./utils/network";

class Register extends LitElement {
  constructor() {
    super();

    this._isCurrentFlowComplete = false;
    this._isRegisterFlow = true;
    this._isRecoveryFlow = false;
    this._isAddFlow = false;
  }

  static get properties() {
    return {
      _isCurrentFlowComplete: Boolean,
      _recoveryToken: String,
      _isRegisterFlow: Boolean,
      _isRecoveryFlow: Boolean,
      _isAddFlow: Boolean,
    };
  }

  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    this.querySelectorAll("summary").forEach((summary) =>
      summary.addEventListener("click", this._setFlow.bind(this))
    );
  }

  render() {
    return html`
      <h2 class="${pageSubtitle}">Register</h2>
      <p id="notification" class="${notification}"></p>
      <div class="${card}">
        <details class="${details}" data-type="register" .open=${this._isRegisterFlow}>
          <summary>Register a new account</summary>
          ${this._isRegisterFlow && !this._isCurrentFlowComplete
            ? html`
                <form class="${form}" @submit="${this._startRelyingPartyFlow}">
                  <label for="username">
                    Username
                    <input type="text" id="username" name="username" required />
                  </label>
                  <button type="submit">Register</button>
                </form>
              `
            : html`
                <p>Your recovery token is:</p>
                <p class="${itemsRow}">
                  <code class="${code}">${this._recoveryToken}</code
                  ><button @click="${this._copyRecoveryTokenToClipboard}" class="${iconButton}">
                    📋
                  </button>
                </p>
                <p>⚠️ Be sure to save it in a safe and secure place.</p>
              `}
        </details>
        <details class="${details}" data-type="recover" .open="${this._isRecoveryFlow}">
          <summary>Recover account access</summary>
          ${this._isRecoveryFlow && !this._isCurrentFlowComplete
            ? html`
                <form class="${form}" @submit="${this._startRelyingPartyFlow}">
                  <label for="recoveryToken">
                    Recovery token
                    <input type="text" id="recoveryToken" name="recoveryToken" required />
                  </label>
                  <button type="submit">Recover</button>
                </form>
              `
            : html`
                <p>Your account has been successfuly recovered on this device!</p>
                <p>Your recovery token is:</p>
                <p class="${itemsRow}">
                  <code class="${code}">${this._recoveryToken}</code
                  ><button @click="${this._copyRecoveryTokenToClipboard}" class="${iconButton}">
                    📋
                  </button>
                </p>
                <p>⚠️ Be sure to save it in a safe and secure place.</p>
              `}
        </details>
        <details class="${details}" data-type="add" .open="${this._isAddFlow}">
          <summary>Add new device</summary>
          ${this._isAddFlow && !this._isCurrentFlowComplete
            ? html`
                <form class="${form}" @submit="${this._startRelyingPartyFlow}">
                  <label for="registrationAddToken">
                    Registration add token
                    <input
                      type="text"
                      id="registrationAddToken"
                      name="registrationAddToken"
                      required
                    />
                  </label>
                  <button type="submit">Add new device</button>
                </form>
              `
            : html`<p>This device has been successfuly added to an existing account!</p>`}
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

  async _startRelyingPartyFlow(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    let body = {};

    if (this._isRegisterFlow) {
      setNotificationMessage("Starting registration process", "info");
      body.username = formData.get("username");
    }

    if (this._isRecoveryFlow) {
      setNotificationMessage("Starting recovery process", "info");
      body.recoveryToken = formData.get("recoveryToken");
    }

    if (this._isAddFlow) {
      setNotificationMessage("Starting add new device process", "info");
      body.registrationAddToken = formData.get("registrationAddToken");
    }

    try {
      const startResponse = await request("/api/registration/start", {
        method: "POST",
        body: JSON.stringify(body),
      });

      const { status, registrationId, publicKeyCredentialCreationOptions } = startResponse;

      if (status === "OK") {
        publicKeyCredentialCreationOptions.user.id = base64UrlStringToUint8Array(
          publicKeyCredentialCreationOptions.user.id
        );
        publicKeyCredentialCreationOptions.challenge = base64UrlStringToUint8Array(
          publicKeyCredentialCreationOptions.challenge
        );
        publicKeyCredentialCreationOptions.excludeCredentials = [
          ...(publicKeyCredentialCreationOptions.excludeCredentials || []).map((excred) => {
            const id = base64UrlStringToUint8Array(excred.id);
            return {
              ...excred,
              id,
            };
          }),
        ];

        const credential = await navigator.credentials.create({
          publicKey: publicKeyCredentialCreationOptions,
        });

        this._completeRelyingPartyFlow(registrationId, parseRegisterCredential(credential));
      }
    } catch (error) {
      setNotificationMessage(error.message, "error");
    }
  }

  async _completeRelyingPartyFlow(registrationId, credential) {
    let successMessage = "";

    if (this._isRegisterFlow) {
      successMessage = "Account successfuly created!";
    }

    if (this._isRecoveryFlow) {
      successMessage = "Account successfuly recovered on this device!";
    }

    if (this._isAddFlow) {
      successMessage = "Device successfuly added to an existing account!";
    }

    try {
      const finishResponse = await request("/api/registration/finish", {
        method: "POST",
        body: JSON.stringify({ registrationId, credential }),
      });

      this._recoveryToken = finishResponse.recoveryToken;
      this._isCurrentFlowComplete = true;

      setNotificationMessage(successMessage, "success");
    } catch (error) {
      setNotificationMessage(error.message, "error");
    }
  }

  async _copyRecoveryTokenToClipboard() {
    await navigator.clipboard.writeText(this._recoveryToken);
    setNotificationMessage("Recovery token copied to clipboard", "info");
    setTimeout(clearNotificationMessage, 3000);
  }
}

customElements.define("auth-register", Register);
