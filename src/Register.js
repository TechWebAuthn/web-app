import { LitElement, html } from "lit";
import UAParser from "ua-parser-js";
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
import { decodePublicKeyCredentialCreateOptions, encodeRegisterCredential } from "./utils/parse";
import { clearNotificationMessage, setNotificationMessage } from "./utils/notification";
import { request } from "./utils/network";
import { WebRTCConnection, WebSocketConnection } from "./utils/webrtc";

class Register extends LitElement {
  constructor() {
    super();

    this._isCurrentFlowComplete = false;
    this._isRegisterFlow = true;
    this._isRecoveryFlow = false;
    this._isAddFlow = false;
    this._addFlowCode = "";
    this._addFlowUser = "";

    this.RTC = null;
  }

  static get properties() {
    return {
      _isCurrentFlowComplete: Boolean,
      _recoveryToken: String,
      _isRegisterFlow: Boolean,
      _isRecoveryFlow: Boolean,
      _isAddFlow: Boolean,
      _addFlowCode: String,
      _addFlowUser: String,
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
          <summary>Add device to existing account</summary>
          ${this._isAddFlow && !this._isCurrentFlowComplete
            ? html`
                ${!this._addFlowUser
                  ? html`
                      <form class="${form}" @submit="${this._startExternalConnection}">
                        <button type="submit">Generate code</button>
                        <p .hidden="${!this._addFlowCode}">
                          <code data-size="full" class="${code}">${this._addFlowCode}</code>
                        </p>
                      </form>
                    `
                  : html`
                      <form class="${form}" @submit="${this._startEnrollmentFlow}">
                        <button>Add device to ${this._addFlowUser}'s account</button>
                        <button data-type="danger" @click="${this._cancelEnrollmentFlow}">
                          Cancel
                        </button>
                      </form>
                    `}
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

    let formData;
    let body = {};

    if (event.target instanceof HTMLFormElement) {
      formData = new FormData(event.target);
    }

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
      body.registrationAddToken = event.detail.token;
    }

    try {
      const startResponse = await request("/api/registration/start", {
        method: "POST",
        body: JSON.stringify(body),
      });

      const { status, registrationId, publicKeyCredentialCreationOptions } = startResponse;

      if (status === "OK") {
        const credential = await navigator.credentials.create({
          publicKey: decodePublicKeyCredentialCreateOptions(publicKeyCredentialCreationOptions),
        });

        this._completeRelyingPartyFlow(registrationId, encodeRegisterCredential(credential));
      }
    } catch (error) {
      setNotificationMessage(error.message, "error");
    }
  }

  async _completeRelyingPartyFlow(registrationId, credential) {
    let successMessage = "";

    try {
      const parsedResult = new UAParser().getResult();
      const userAgent = `${parsedResult.device.type} || ${
        parsedResult.browser.name
      } ${parsedResult.browser.version.split(".").shift()} :: ${parsedResult.os.name} ${
        parsedResult.os.version
      }`;

      const finishResponse = await request("/api/registration/finish", {
        method: "POST",
        body: JSON.stringify({ registrationId, credential, userAgent }),
      });

      this._recoveryToken = finishResponse.recoveryToken;
      this._isCurrentFlowComplete = true;

      if (this._isRegisterFlow) {
        successMessage = "Account successfuly created!";
      }

      if (this._isRecoveryFlow) {
        successMessage = "Account successfuly recovered on this device!";
      }

      if (this._isAddFlow) {
        successMessage = "Device successfuly added to an existing account!";
        this.RTC.dataChannel.send("event::complete");
      }

      setNotificationMessage(successMessage, "success");
    } catch (error) {
      setNotificationMessage(error.message, "error");
    }
  }

  async _copyRecoveryTokenToClipboard() {
    await navigator.clipboard.writeText(this._recoveryToken);
    setNotificationMessage("Recovery token copied to clipboard", "info");
  }

  _startExternalConnection(event) {
    event.preventDefault();

    this.RTC?.close();
    clearNotificationMessage();

    this.RTC = new WebRTCConnection(new WebSocketConnection("/api/socket"));
    this.RTC.createDataChannel();
    this.RTC.oncode = (code) => {
      this._addFlowCode = code;
    };
    this.RTC.onuser = async (user) => {
      await this.RTC.createOffer();
      setNotificationMessage(`User ${user} wants to claim this device`, "info", false);
      this._addFlowUser = user;
    };
  }

  _startEnrollmentFlow(event) {
    event.preventDefault();

    this.RTC.sendData("action::add");
    this.RTC.ondatachannelmessage = (event) => {
      const [type, data] = event.data.split("::");

      if (type === "token") {
        this._startRelyingPartyFlow(new CustomEvent("add-device", { detail: { token: data } }));
      }
    };
    this.RTC.listenForData();
  }

  _cancelEnrollmentFlow(event) {
    event.preventDefault();

    this.RTC.sendData("action::cancel");

    this.RTC?.close();
    clearNotificationMessage();
    this._addFlowCode = "";
    this._addFlowUser = "";
  }
}

customElements.define("auth-register", Register);
