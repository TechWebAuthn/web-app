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

      if (status === "OK") {
        publicKeyCredentialCreationOptions?.user?.id = Uint8Array.from(window.atob(publicKeyCredentialCreationOptions?.user?.id), c => c.charCodeAt(0));
        publicKeyCredentialCreationOptions?.challenge = Uint8Array.from(window.atob(publicKeyCredentialCreationOptions?.challenge), c => c.charCodeAt(0));

        const credentials = await navigator.credentials.create({
          publicKey: publicKeyCredentialCreationOptions,
        });

        const finishResponse = await fetch("/api/registration/finish", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ registrationId, credentials }),
        });

        const recoveryToken = await finishResponse.text();

        console.log(recoveryToken);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

customElements.define("auth-register", Register);
