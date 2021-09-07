import { html, unsafeCSS, css } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import { setNotificationMessage, clearNotificationMessage } from "../utils/notification";
import "webauthn-components/rtc/enrollment-requester";
import "../components/logs";
import forms from "../styles/forms.css";
import cards from "../styles/cards.css";
import codes from "../styles/codes.css";
import notifications from "../styles/notifications.css";
import loaders from "../styles/loaders.css";
import slides from "../styles/slides.css?inline";

class WebAuthnAddNew extends PresentationPageTemplate {
  constructor() {
    super();

    this._setNotificationMessage = setNotificationMessage.bind(this);
    this._isFlowComplete = false;
    this._showLoader = false;
    this.rtcIceServers = [
      { urls: "stun:stun.services.mozilla.com" },
      {
        urls: import.meta.env.VITE_TURN_URL,
        username: import.meta.env.VITE_TURN_USERNAME,
        credential: import.meta.env.VITE_TURN_CREDENTIAL,
      },
    ];
  }

  static get styles() {
    return [
      unsafeCSS(forms),
      unsafeCSS(cards),
      unsafeCSS(codes),
      unsafeCSS(notifications),
      unsafeCSS(loaders),
      unsafeCSS(slides),
      css`
        web-authn-rtc-enrollment-requester::part(code) {
          box-sizing: border-box;
        }
      `,
    ];
  }

  render() {
    return html`
      <h1>Web Authn - Add a new device</h1>

      <article>
        <aside class="fit-content">
          <output class="device">
            <h2>Add new device</h2>
            <p id="notification" class="notification"></p>
            <div class="card">
              ${!this._isFlowComplete
                ? !this._showLoader
                  ? html`
                      <webauthn-rtc-enrollment-requester
                        class="form"
                        @enrollment-code-requested="${this._onEnrollmentEvent}"
                        @enrollment-started="${this._onEnrollmentEvent}"
                        @enrollment-created="${this._onEnrollmentEvent}"
                        @enrollment-completed="${this._onEnrollmentEvent}"
                        @enrollment-error="${this._onEnrollmentEvent}"
                        @enrollment-cancelled="${this._onEnrollmentEvent}"
                        .rtcIceServers="${this.rtcIceServers}"
                      ></web-authn-rtc-enrollment-requester>
                    `
                  : html`<div class="center"><progress class="loader" indeterminate></progress></div>`
                : html` <p>Your device has been successfuly added to another account!</p> `}
            </div>
          </output>
        </aside>
        <section class="column">
          <auth-logs></auth-logs>
        </section>
        <section class="column">
          <figure>
            <img src="/images/webauthn-enroll.png" alt="WebAuthn Add New Device" />
            <figcaption>
              <a href="https://www.freepik.com/vectors/user">User vector created by stories</a>
            </figcaption>
          </figure>
        </section>
      </article>
    `;
  }

  async _onEnrollmentEvent(event) {
    const { type } = event;
    let message = event.detail?.message;
    let notificationType = "info";

    switch (type) {
      case "enrollment-code-requested":
        message = "Generating enrollment code";
        clearNotificationMessage(this.shadowRoot.querySelector("#notification"));
        break;
      case "enrollment-started":
        message = "Starting enrollment process";
        this._showLoader = true;
        break;
      case "enrollment-created":
        message = "Validating credentials with server";
        break;
      case "enrollment-completed":
        message = "Enrollment completed successfuly";
        notificationType = "success";
        this._isFlowComplete = true;
        this._showLoader = false;
        break;
      case "enrollment-cancelled":
        message = message || "Enrollment has been cancelled";
        notificationType = "error";
        this._showLoader = true;
        break;
      case "enrollment-error":
        message = message || "Enrollment could not be successfully completed";
        notificationType = "error";
        this._showLoader = true;
        break;
    }

    this._setNotificationMessage(message, notificationType);
  }

  get _prompterMessage() {
    return `
      # Web Authn - Add a new device

      Using a recovery key could sometimes be a good fit when switching devices, but perhaps we want to access our account from multiple devices, such as laptops and smartphones.

      There are multiple ways to do this, and the specification describes a simple scenario of using a roaming authenticator to register new devices.

      What if we don't use a roaming authenticator?

      - manually move the registration token from one device to another
      - send the registration token through the relying party or another service
      - send it between the two devices using a peer-to-peer connection
    `;
  }
}

customElements.define("presentation-web-authn-add-new", WebAuthnAddNew);
