import { LitElement, html, css, unsafeCSS } from "lit";
import { setNotificationMessage } from "./utils/notification";
import { hasValidSession } from "./utils/session";
import "./components/web-authn-login";

import resets from "./styles/resets.css";
import cards from "./styles/cards.css";
import forms from "./styles/forms.css";
import headings from "./styles/headings.css";
import notifications from "./styles/notifications.css";

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
          @assertion-start="${this._onWebAuthnLoginEvent}"
          @assertion-respond="${this._onWebAuthnLoginEvent}"
          @assertion-finished="${this._onWebAuthnLoginEvent}"
          @assertion-error="${this._onWebAuthnLoginEvent}"
        ></web-authn-login>
      </div>
    `;
  }

  async _onLoginEvent(event) {
    const { type } = event;
    let message = event.detail?.message;
    let notificationType = "info";

    switch (type) {
      case "assertion-start":
        message = "Starting authentication process";
        break;
      case "assertion-respond":
        message = "Validating credentials with server";
        break;
      case "assertion-finished":
        message = "Authentication completed successfuly";
        notificationType = "success";
        break;
      case "assertion-error":
        message = message || "Authentication could not be completed successfully";
        notificationType = "error";
        break;
    }

    this._setNotificationMessage(message, notificationType);

    if (type === "assertion-finished") {
      await hasValidSession();
    }
  }
}

customElements.define("auth-login", Login);
