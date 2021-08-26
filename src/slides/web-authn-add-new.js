import { LitElement, html, unsafeCSS, css } from "lit";
import slides from "../styles/slides.css?inline";
import { setNotificationMessage, clearNotificationMessage } from "../utils/notification";
import "web-authn-components/rtc/enrollment-requester";
import forms from "../styles/forms.css";
import cards from "../styles/cards.css";
import codes from "../styles/codes.css";
import notifications from "../styles/notifications.css";
import loaders from "../styles/loaders.css";

class WebAuthnAddNew extends LitElement {
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
            <h2>Recover account</h2>
            <p id="notification" class="notification"></p>
            <div class="card">
              ${!this._isFlowComplete
                ? !this._showLoader
                  ? html`
                      <web-authn-rtc-enrollment-requester
                        class="form"
                        @enrollment-code-requested="${this._onEnrollmentEvent}"
                        @enrollment-started="${this._onEnrollmentEvent}"
                        @enrollment-created="${this._onEnrollmentEvent}"
                        @enrollment-completed="${this._onEnrollmentEvent}"
                        @enrollment-error="${this._onEnrollmentEvent}"
                        @enrollment-canceled="${this._onEnrollmentEvent}"
                        .rtcIceServers="${this.rtcIceServers}"
                      ></web-authn-rtc-enrollment-requester>
                    `
                  : html`<div class="center"><progress class="loader" indeterminate></progress></div>`
                : html` <p>Your device has been successfuly added to another account!</p> `}
            </div>
          </output>
        </aside>
        <section>
          <h2>How to add a new device</h2>
          <ul>
            <li>Step 1...</li>
            <li>Step 2...</li>
            <li>Step 3...</li>
          </ul>
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
      case "enrollment-canceled":
        message = message || "Enrollment has been canceled";
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

  _startExternalConnection() {
    this.RTC?.close();
    clearNotificationMessage(this.shadowRoot.querySelector("#notification"));
    const enrollmentComponent = this.shadowRoot.querySelector("web-authn-enroll");

    this.RTC = new WebRTCConnection(new WebSocketConnection("/api/socket"));
    this.RTC.createDataChannel();
    this.RTC.oncode = (code) => {
      enrollmentComponent.peerCode = code;
    };
    this.RTC.onuser = async (user) => {
      await this.RTC.createOffer();
      this._setNotificationMessage(`User ${user} wants to claim this device`, "info", false);
      enrollmentComponent.agreementText = `I understand that this device will be added to ${user}'s account`;
      enrollmentComponent.dispatchEvent(new CustomEvent("enrollment-code-confirmed"));
    };
  }

  _requestRegistrationAddToken() {
    const enrollmentComponent = this.shadowRoot.querySelector("web-authn-enroll");

    this.RTC.sendData("action::add");
    this.RTC.ondatachannelmessage = (event) => {
      const [type, data] = event.data.split("::");

      if (type === "token") {
        enrollmentComponent.registrationAddToken = data;
      }
    };
    this.RTC.listenForData();
  }

  _cancelEnrollmentFlow() {
    this.RTC.sendData("action::cancel");
    this.RTC?.close();
  }
}

customElements.define("presentation-web-authn-add-new", WebAuthnAddNew);