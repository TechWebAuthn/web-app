import { LitElement, html } from "lit";
import {
  card,
  form,
  code,
  notification,
  iconButton,
  itemsRow,
  pageSubtitle,
} from "../public/css/component.module.css";
import { base64UrlStringToUint8Array, parseRegisterCredential } from "./utils/parse";
import { clearNotificationMessage, setNotificationMessage } from "./utils/notification";

class Register extends LitElement {
  constructor() {
    super();

    this._registrationComplete = false;
  }

  static get properties() {
    return {
      _registrationComplete: Boolean,
      _recoveryCode: String,
    };
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html` <h2 class="${pageSubtitle}">Register</h2>
      <p id="notification" class="${notification}"></p>
      <div class="${card}">
        ${!this._registrationComplete
          ? html`
              <form class="${form}" @submit="${this._startRegister}">
                <label for="username">
                  Username
                  <input type="text" id="username" name="username" required />
                </label>
                <button type="submit">Register</button>
              </form>
            `
          : html`
              <p>Your recovery code is:</p>
              <p class="${itemsRow}">
                <code class="${code}">${this._recoveryCode}</code
                ><button @click="${this._copyRecoveryCodeToClipboard}" class="${iconButton}">
                  📋
                </button>
              </p>
              <p>⚠️ Be sure to save it in a safe and secure place.</p>
            `}
      </div>`;
  }

  async _startRegister(event) {
    event.preventDefault();

    setNotificationMessage(
      document.getElementById("notification"),
      "Starting registration process",
      "info"
    );

    const formData = new FormData(event.target);
    const username = formData.get("username");

    try {
      const startResponse = await fetch("/api/registration/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const { status, registrationId, publicKeyCredentialCreationOptions } =
        await startResponse.json();

      if (status === "USERNAME_TAKEN") {
        throw new Error("Username is already taken");
      }

      if (status === "TOKEN_INVALID") {
        throw new Error("Token is invalid");
      }

      if (status === "OK") {
        publicKeyCredentialCreationOptions.user.id = base64UrlStringToUint8Array(
          publicKeyCredentialCreationOptions.user.id
        );
        publicKeyCredentialCreationOptions.challenge = base64UrlStringToUint8Array(
          publicKeyCredentialCreationOptions.challenge
        );

        const credential = await navigator.credentials.create({
          publicKey: publicKeyCredentialCreationOptions,
        });

        this._completeRegister(registrationId, parseRegisterCredential(credential));
      }
    } catch (error) {
      setNotificationMessage(
        document.getElementById("notification"),
        error.message || "Something went wrong",
        "error"
      );
    }
  }

  async _completeRegister(registrationId, credential) {
    try {
      const finishResponse = await fetch("/api/registration/finish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ registrationId, credential }),
      });

      this._recoveryCode = await finishResponse.text();
      this._registrationComplete = true;

      setNotificationMessage(
        document.getElementById("notification"),
        "Account successfuly created!",
        "success"
      );
    } catch (error) {
      setNotificationMessage(
        document.getElementById("notification"),
        "Something went wrong",
        "error"
      );
    }
  }

  async _copyRecoveryCodeToClipboard() {
    await navigator.clipboard.writeText(this._recoveryCode);
    setNotificationMessage(
      document.getElementById("notification"),
      "Recovery code copied to clipboard",
      "info"
    );
    setTimeout(() => clearNotificationMessage(document.getElementById("notification")), 3000);
  }
}

customElements.define("auth-register", Register);
