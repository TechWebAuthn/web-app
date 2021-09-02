import { css, html, unsafeCSS } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import { setNotificationMessage } from "../utils/notification";
import { request } from "../utils/network";
import "web-authn-components/login";
import "../components/logs";
import forms from "../styles/forms.css";
import cards from "../styles/cards.css";
import notifications from "../styles/notifications.css";
import slides from "../styles/slides.css?inline";

class WebAuthnAuthentication extends PresentationPageTemplate {
  constructor() {
    super();

    this._setNotificationMessage = setNotificationMessage.bind(this);
    this._isLoggedIn = false;
  }

  static get properties() {
    return {
      _isLoggedIn: Boolean,
      _username: String,
    };
  }

  static get styles() {
    return [
      unsafeCSS(forms),
      unsafeCSS(cards),
      unsafeCSS(notifications),
      unsafeCSS(slides),
      css`
        web-authn-login::part(input) {
          box-sizing: border-box;
        }
      `,
    ];
  }

  render() {
    return html`
      <h1>Web Authn - Authentication</h1>

      <article>
        <aside class="fit-content">
          <output class="device">
            <h2>Login</h2>
            <p id="notification" class="notification"></p>
            <div class="card">
              ${!this._isLoggedIn
                ? html`
                    <web-authn-login
                      class="form"
                      @login-started="${this._onWebAuthnLoginEvent}"
                      @login-retrieved="${this._onWebAuthnLoginEvent}"
                      @login-finished="${this._onWebAuthnLoginEvent}"
                      @login-error="${this._onWebAuthnLoginEvent}"
                    ></web-authn-login>
                  `
                : html`
                    <p>Welcome back, <b>${this._username}!</b></p>
                    <form class="form" @submit="${this._logout}">
                      <button data-type="danger">Logout</button>
                    </form>
                  `}
            </div>
          </output>
        </aside>
        <section class="column">
          <auth-logs></auth-logs>
        </section>
        <section class="column">
          <figure>
            <img src="/images/webauthn-login.png" alt="WebAuthn Login" />
            <figcaption>
              <a href="https://www.freepik.com/vectors/sign">Sign vector created by stories</a>
            </figcaption>
          </figure>
        </section>
      </article>
    `;
  }
  async _onWebAuthnLoginEvent(event) {
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
        this._isLoggedIn = true;
        const { username } = await request("/api/me");
        this._username = username;
        break;
      case "login-error":
        message = message || "Authentication could not be completed successfully";
        notificationType = "error";
        break;
    }

    this._setNotificationMessage(message, notificationType);
  }

  async _logout(event) {
    event.preventDefault();

    await request("/api/logout", {
      method: "POST",
    });

    this._isLoggedIn = false;
  }

  get _prompterMessage() {
    return `
      # Web Authn - Authentication
    `;
  }
}

customElements.define("presentation-web-authn-authentication", WebAuthnAuthentication);
