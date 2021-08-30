import { LitElement, html, unsafeCSS, css } from "lit";
import { setNotificationMessage } from "../utils/notification";
import "web-authn-components/recovery";
import "../components/logs";
import forms from "../styles/forms.css";
import cards from "../styles/cards.css";
import notifications from "../styles/notifications.css";
import slides from "../styles/slides.css?inline";

class WebAuthnRecover extends LitElement {
  constructor() {
    super();

    this._setNotificationMessage = setNotificationMessage.bind(this);
  }

  static get styles() {
    return [
      unsafeCSS(forms),
      unsafeCSS(cards),
      unsafeCSS(notifications),
      unsafeCSS(slides),
      css`
        web-authn-recovery::part(input) {
          box-sizing: border-box;
        }
      `,
    ];
  }

  render() {
    return html`
      <h1>Web Authn - Recover account access</h1>

      <article>
        <aside class="fit-content">
          <output class="device">
            <h2>Recover account</h2>
            <p id="notification" class="notification"></p>
            <div class="card">
              <web-authn-recovery
                class="form"
                @recovery-started="${this._onRecoverEvent}"
                @recovery-created="${this._onRecoverEvent}"
                @recovery-finished="${this._onRecoverEvent}"
                @recovery-error="${this._onRecoverEvent}"
              ></web-authn-recovery>
            </div>
          </output>
        </aside>
        <section class="column">
          <auth-logs></auth-logs>
        </section>
        <section class="column">
          <figure>
            <img src="/images/webauthn-recover.png" alt="WebAuthn Recover Account Access" />
            <figcaption>
              <a href="https://www.freepik.com/vectors/website">Website vector created by stories</a>
            </figcaption>
          </figure>
        </section>
      </article>
    `;
  }

  async _onRecoverEvent(event) {
    const { type } = event;
    let message = event.detail?.message;
    let notificationType = "info";

    switch (type) {
      case "recovery-started":
        message = "Starting recovery process";
        break;
      case "recovery-created":
        message = "Validating credentials with server";
        break;
      case "recovery-finished":
        message = "Recovery completed successfuly";
        notificationType = "success";
        this._recoveryToken = event.detail?.recoveryToken;
        this._isCurrentFlowComplete = true;
        break;
      case "recovery-error":
        message = message || "Recovery could not be successfully completed";
        notificationType = "error";
        break;
    }

    this._setNotificationMessage(message, notificationType);
  }
}

customElements.define("presentation-web-authn-recover", WebAuthnRecover);
