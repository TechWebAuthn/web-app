import { LitElement, html, css, unsafeCSS } from "lit";
import { setNotificationMessage } from "./utils/notification";

import resets from "./styles/resets.css?inline";
import cards from "./styles/cards.css?inline";
import forms from "./styles/forms.css?inline";
import headings from "./styles/headings.css?inline";
import notifications from "./styles/notifications.css?inline";

class PassLogin extends LitElement {
  constructor() {
    super();

    this._setNotificationMessage = setNotificationMessage.bind(this);
  }

  static get styles() {
    return [unsafeCSS(resets), unsafeCSS(cards), unsafeCSS(forms), unsafeCSS(headings), unsafeCSS(notifications)];
  }

  render() {
    return html`
      <h2 class="page-subtitle">Login with password</h2>
      <p id="notification" class="notification"></p>
      <div class="card">
        <form class="form" @submit=${this._onSubmit}>
          <label>
            Username
            <input type="text" name="username" />
          </label>
          <label>
            Password
            <input type="password" name="password" />
          </label>
          <button type="submit">Login</button>
        </form>
      </div>
    `;
  }

  async _onSubmit(event) {
    event.preventDefault();

    const data = new URLSearchParams(new FormData(event.target));

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: data,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const result = await response.json();

      console.log("Result", result);

      let message = event.detail?.message;
      let notificationType = "info";

      this._setNotificationMessage(message, notificationType);
    } catch (error) {
      this._setNotificationMessage(error.message || "Something went wrong", "error");
    }
  }
}

customElements.define("auth-pass-login", PassLogin);
