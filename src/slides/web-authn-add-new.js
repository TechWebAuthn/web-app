import { LitElement, html, unsafeCSS, css } from "lit";
import slides from "../styles/slides.css?inline";
import { setNotificationMessage, clearNotificationMessage } from "../utils/notification";
import { WebRTCConnection, WebSocketConnection } from "../utils/webrtc";
import "web-authn-components/enroll";
import forms from "../styles/forms.css";
import cards from "../styles/cards.css";
import codes from "../styles/codes.css";
import notifications from "../styles/notifications.css";

class WebAuthnAddNew extends LitElement {
  constructor() {
    super();

    this._setNotificationMessage = setNotificationMessage.bind(this);
  }

  static get styles() {
    return [
      unsafeCSS(forms),
      unsafeCSS(cards),
      unsafeCSS(codes),
      unsafeCSS(notifications),
      unsafeCSS(slides),
      css`
        web-authn-enroll::part(code) {
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
              <web-authn-enroll
                class="form"
                @enrollment-code-requested="${this._onEnrollmentEvent}"
                @enrollment-agreement-accepted="${this._onEnrollmentEvent}"
                @enrollment-start="${this._onEnrollmentEvent}"
                @enrollment-respond="${this._onEnrollmentEvent}"
                @enrollment-finished="${this._onEnrollmentEvent}"
                @enrollment-error="${this._onEnrollmentEvent}"
                @enrollment-canceled="${this._onEnrollmentEvent}"
              ></web-authn-enroll>
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
        this._startExternalConnection();
        break;
      case "enrollment-agreement-accepted":
        this._requestRegistrationAddToken();
        break;
      case "enrollment-start":
        message = "Starting enrollment process";
        this._showAddFlowLoader = true;
        break;
      case "enrollment-respond":
        message = "Validating credentials with server";
        break;
      case "enrollment-finished":
        message = "Enrollment completed successfuly";
        notificationType = "success";
        this._isCurrentFlowComplete = true;
        this.RTC.dataChannel.send("event::complete");
        this._showAddFlowLoader = false;
        break;
      case "enrollment-canceled":
        message = message || "Enrollment has been canceled";
        notificationType = "error";
        this._cancelEnrollmentFlow();
        break;
      case "enrollment-error":
        message = message || "Enrollment could not be successfully completed";
        notificationType = "error";
        this._cancelEnrollmentFlow();
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
