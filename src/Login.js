import { LitElement, html, css, unsafeCSS } from "lit";
import { setNotificationMessage } from "./utils/notification";
import { hasValidSession } from "./utils/session";
import "web-authn-components/login";

import resets from "./styles/resets.css?inline";
import cards from "./styles/cards.css?inline";
import forms from "./styles/forms.css?inline";
import headings from "./styles/headings.css?inline";
import notifications from "./styles/notifications.css?inline";

class Login extends LitElement {
  constructor() {
    super();

    this._onWebAuthnLoginEvent = this._onLoginEvent.bind(this);
    this._setNotificationMessage = setNotificationMessage.bind(this);
  }

  static get styles() {
    return [
      unsafeCSS(resets),
      unsafeCSS(cards),
      unsafeCSS(forms),
      unsafeCSS(headings),
      unsafeCSS(notifications),
      css`
        web-authn-login::part(input) {
          box-sizing: border-box;
        }
      `,
    ];
  }

  render() {
    return html`
      <h2 class="page-subtitle">Login</h2>
      <p id="notification" class="notification"></p>
      <div class="card">
        <web-authn-login
          class="form"
          @login-started="${this._onWebAuthnLoginEvent}"
          @login-retrieved="${this._onWebAuthnLoginEvent}"
          @login-finished="${this._onWebAuthnLoginEvent}"
          @login-error="${this._onWebAuthnLoginEvent}"
        ></web-authn-login>
      </div>
    `;
  }

  async _onLoginEvent(event) {
    const { type } = event;
    let message = event.detail?.message;
    let notificationType = "info";

    switch (type) {
      case "login-started":
        message = "Starting authentication process";
        break;
      case "login-retrieved":
        message = "Validating credentials with server";
        break;
      case "login-finished":
        message = "Authentication completed successfuly";
        notificationType = "success";
        break;
      case "login-error":
        message = message || "Authentication could not be completed successfully";
        notificationType = "error";
        break;
    }

    this._setNotificationMessage(message, notificationType);

    if (type === "login-finished") {
      await hasValidSession();
    }
  }
}

customElements.define("auth-login", Login);
