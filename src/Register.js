import { LitElement, html } from "lit";
import { card, form } from "../public/css/component.module.css";

class Register extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`<h1>Register</h1>
      <div class="${card}" @submit=${this._startRegister}>
        <form class="${form}">
          <label for="username">
            Username
            <input type="text" id="username" name="username" required />
          </label>
          <button type="submit">Register</button>
        </form>
      </div>`;
  }

  async _startRegister(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const username = formData.get("username");

    const createCredentialsArgs = {
      publicKey: {
        challenge: Uint8Array.from("randomStringFromServer", (c) => c.charCodeAt(0)),
        rp: {
          name: "WebAuth + WebRTC",
          id: "auth.marv.ro",
        },
        user: {
          id: window.crypto.getRandomValues(new Uint8Array(16)),
          name: username,
          displayName: username,
        },
        authenticatorSelection: {
          authenticatorAttachment: "cross-platform",
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        timeout: 60000,
        attestation: "direct",
      },
    };

    const credentials = await navigator.credentials.create(createCredentialsArgs);
  }
}

customElements.define("auth-register", Register);
