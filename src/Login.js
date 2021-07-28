import { LitElement, html } from "lit";
import { card, form, notification, pageSubtitle } from "../public/css/component.module.css";
import { request } from "./utils/network";
import { setNotificationMessage } from "./utils/notification";
import { base64UrlStringToUint8Array, parseLoginCredential } from "./utils/parse";
import { hasValidSession, setSession } from "./utils/session";

class Login extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <h2 class="${pageSubtitle}">Login</h2>
      <p id="notification" class="${notification}"></p>
      <div class="${card}">
        <form class="${form}" @submit="${this._startLogin}">
          <label for="username">
            Username
            <input type="text" id="username" name="username" required />
          </label>
          <button type="submit">Login</button>
        </form>
      </div>
    `;
  }

  async _startLogin(event) {
    event.preventDefault();

    setNotificationMessage("Starting login process", "info");

    const formData = new FormData(event.target);
    const username = formData.get("username");

    try {
      const startResponse = await request("/api/assertion/start", {
        method: "POST",
        body: username,
      });

      const { assertionId, publicKeyCredentialRequestOptions } = startResponse;

      const publicKey = {
        ...publicKeyCredentialRequestOptions,
        challenge: base64UrlStringToUint8Array(publicKeyCredentialRequestOptions.challenge),
        allowCredentials: publicKeyCredentialRequestOptions.allowCredentials.map((cred) => {
          const id = base64UrlStringToUint8Array(cred.id);
          return {
            ...cred,
            id,
          };
        }),
      };

      const credential = await navigator.credentials.get({ publicKey });
      setNotificationMessage("Validating credentials with server", "info");
      this._completeLogin(assertionId, parseLoginCredential(credential));
    } catch (error) {
      setNotificationMessage(error.message, "error", false);
    }
  }

  async _completeLogin(assertionId, credential) {
    try {
      await request("/api/assertion/finish", {
        method: "POST",
        body: JSON.stringify({ assertionId, credential }),
      });

      await hasValidSession();
    } catch (error) {
      setNotificationMessage(error.message, "error", false);
    }
  }
}

customElements.define("auth-login", Login);
