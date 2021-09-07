import { html, unsafeCSS, css } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import { setNotificationMessage } from "../utils/notification";
import "webauthn-components/recovery";
import "../components/logs";
import forms from "../styles/forms.css";
import cards from "../styles/cards.css";
import notifications from "../styles/notifications.css";
import slides from "../styles/slides.css?inline";

class WebAuthnRecover extends PresentationPageTemplate {
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
        webauthn-recovery::part(input) {
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
              <webauthn-recovery
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

  get _prompterMessage() {
    return `
      # Web Authn - Recover account access

      The credentials are on a personal device, a smartphone perhaps, which means that if we misplace or even lose it, that would render us unable to access our account.

      We stored our recovery key in a safe place in the registration step, and now it's time to use it.

      Using this key, we'll be able to claim the account again through a process similar to registration; this will also remove all devices previously tied to this account.
    `;
  }
}

customElements.define("presentation-web-authn-recover", WebAuthnRecover);
