import { LitElement, html } from "lit";
import { card, form, notification, pageSubtitle } from "../public/css/component.module.css";
import { setNotificationMessage } from "./utils/notification";
import { base64UrlStringToUint8Array, parseLoginCredential } from "./utils/parse";
import { setSession } from "./utils/session";

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

    setNotificationMessage(
      document.getElementById("notification"),
      "Starting registration process",
      "info"
    );

    const formData = new FormData(event.target);
    const username = formData.get("username");

    try {
      const startResponse = await fetch("/api/assertion/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: username,
      });

      if (startResponse.status >= 400) {
        throw new Error((await startResponse.json()).message);
      }

      const { assertionId, publicKeyCredentialRequestOptions } = await startResponse.json();

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

      this._completeLogin(assertionId, parseLoginCredential(credential));
    } catch (error) {
      setNotificationMessage(
        document.getElementById("notification"),
        error.message || "Something went wrong",
        "error"
      );
    }
  }

  async _completeLogin(assertionId, credential) {
    try {
      const response = await fetch("/api/assertion/finish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assertionId, credential }),
      });

      setSession(await response.json());
    } catch (error) {
      setNotificationMessage(
        document.getElementById("notification"),
        "Something went wrong",
        "error"
      );
    }
  }
}

customElements.define("auth-login", Login);
