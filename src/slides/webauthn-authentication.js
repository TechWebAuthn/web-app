import { css, html, unsafeCSS } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import { setNotificationMessage } from "../utils/notification";
import { request } from "../utils/network";
import "webauthn-components/login";
import "../components/logs";
import forms from "../styles/forms.css?inline";
import cards from "../styles/cards.css?inline";
import notifications from "../styles/notifications.css?inline";
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
        webauthn-login::part(input) {
          box-sizing: border-box;
        }
      `,
    ];
  }

  render() {
    return html`
      <h1>WebAuthn - Authentication</h1>

      <article>
        <aside class="fit-content">
          <output class="device">
            <h2>Login</h2>
            <p id="notification" class="notification"></p>
            <div class="card">
              ${!this._isLoggedIn
                ? html`
                    <webauthn-login
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
      - this is somehow similar because it involves also 2 steps: getting the challenge and validating the signed challenge
      - we will use the username we previously registered.
      - check the logs
    `;
  }
}

customElements.define("presentation-webauthn-authentication", WebAuthnAuthentication);
