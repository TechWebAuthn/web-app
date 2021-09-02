import { LitElement, html, unsafeCSS, css } from "lit";
import { classMap } from "lit/directives/class-map";
import UAParser from "ua-parser-js/dist/ua-parser.min";
import { request } from "./utils/network";
import { setNotificationMessage } from "./utils/notification";
import { logout, getSession } from "./utils/session";
import "ua-parser-js/dist/ua-parser.min";
import "web-authn-components/rtc/enrollment-provider";

import resets from "./styles/resets.css?inline";
import cards from "./styles/cards.css?inline";
import notifications from "./styles/notifications.css?inline";
import forms from "./styles/forms.css?inline";
import headings from "./styles/headings.css?inline";
import codes from "./styles/codes.css?inline";
import details from "./styles/details.css?inline";
import highlights from "./styles/highlights.css?inline";
import layouts from "./styles/layouts.css?inline";
import deviceLists from "./styles/device-lists.css?inline";
import loaders from "./styles/loaders.css?inline";

class Dashboard extends LitElement {
  constructor() {
    super();

    this._myDevices = [];
    this._addDeviceInProgress = false;
    this._isRemovingCurrentDevice = false;
    this._deviceIdToRemove = null;
    this._setNotificationMessage = setNotificationMessage.bind(this);

    this.rtcIceServers = [
      { urls: "stun:stun.services.mozilla.com" },
      {
        urls: import.meta.env.VITE_TURN_URL,
        username: import.meta.env.VITE_TURN_USERNAME,
        credential: import.meta.env.VITE_TURN_CREDENTIAL,
      },
    ];
  }

  static get properties() {
    return {
      _myDevices: Array,
      _addDeviceInProgress: Boolean,
      _isRemovingCurrentDevice: Boolean,
    };
  }

  static get styles() {
    return [
      unsafeCSS(resets),
      unsafeCSS(cards),
      unsafeCSS(notifications),
      unsafeCSS(forms),
      unsafeCSS(headings),
      unsafeCSS(codes),
      unsafeCSS(details),
      unsafeCSS(highlights),
      unsafeCSS(layouts),
      unsafeCSS(deviceLists),
      unsafeCSS(loaders),
      css`
        [hidden] {
          display: none;
        }

        .device-list .current {
          background-color: var(--canvas-success);
        }

        web-authn-rtc-enrollment-provider::part(input) {
          box-sizing: border-box;
          text-align: center;
          font-family: monospace;
          text-transform: uppercase;
        }
      `,
    ];
  }

  firstUpdated() {
    this._getMyDevices();
  }

  render() {
    const { username } = getSession();

    return html`
      <h2 class="page-subtitle">Dashboard</h2>
      <p id="notification" class="notification"></p>
      <div class="card">
        <h3>Welcome back, <strong class="highlight">${username}</strong>!</h3>
        ${this._myDevices.length
          ? html`
              <h4>Registered devices</h4>
              ${this._isRemovingCurrentDevice
                ? html`
                    <p data-type="error" class="notification">
                      You are about to remove the current device and will be imediately logged out!
                    </p>
                    <form class="form row" @submit=${this._continueDeleteDevice}>
                      <button name="continue">Continue</button>
                      <button name="cancel" data-type="danger">Cancel</button>
                    </form>
                  `
                : ``}
              <ul class="device-list">
                ${this._myDevices.map(
                  (device) =>
                    html`
                      <li class="${classMap({ current: device.currentDevice })}">
                        <span data-type="icon">${this._getDeviceIcon(device.type)}</span>
                        <span data-type="label">${device.description}</span>
                        <form @submit="${this._deleteDevice}" class="form inline">
                          <input type="hidden" name="id" value=${device.id} />
                          <input type="hidden" name="currentDevice" value=${device.currentDevice} />
                          <button data-type="danger" data-size="small">✖</button>
                        </form>
                      </li>
                    `
                )}
              </ul>
            `
          : ``}
        <details class="details">
          <summary>Enroll new device</summary>
          <web-authn-rtc-enrollment-provider
            ?hidden=${this._addDeviceInProgress}
            class="form"
            @enrollment-started="${this._onConnectEvent}"
            @enrollment-completed="${this._onConnectEvent}"
            @enrollment-cancelled="${this._onConnectEvent}"
            @enrollment-error="${this._onConnectEvent}"
            .rtcIceServers=${this.rtcIceServers}
          ></web-authn-rtc-enrollment-provider>
          <div class="center" ?hidden=${!this._addDeviceInProgress}>
            <progress class="loader" indefinite>Loading</progress>
          </div>
        </details>
        <form class="form" @submit="${logout}">
          <button data-type="danger">Logout</button>
        </form>
      </div>
      <div class="card">
        <form class="form" @submit="${this._onFeedbackSubmit}">
          <label for="feedback">Feedback</label>
          <input
            placeholder="How was the presentation?"
            id="feedback"
            name="feedback"
            type="text"
            required
            minlength="2"
            maxlength="32"
            pattern="^(?!.*(<|>|;|,|'|&quot;)).*$"
          />
          <small>Try to use single words</small>
          <button type="submit">Send</button>
        </form>
      </div>
    `;
  }

  async _onConnectEvent(event) {
    const { type } = event;
    let message = event.detail?.message;
    let notificationType = "info";

    switch (type) {
      case "enrollment-started":
        message = "Starting connection to peer";
        this._addDeviceInProgress = true;
        break;
      case "enrollment-completed":
        message = "Sending registration add token";
        this.shadowRoot.querySelector("details").open = false;
        this._getMyDevices();
        this._addDeviceInProgress = false;
        break;
      case "enrollment-cancelled":
        message = "Enrollment has been cancelled";
        notificationType = "error";
        this._addDeviceInProgress = false;
        break;
      case "enrollment-error":
        message = message || "Connection could not be successfully completed";
        notificationType = "error";
        this._addDeviceInProgress = false;
        break;
    }

    this._setNotificationMessage(message, notificationType);
  }

  async _getMyDevices() {
    try {
      const devices = await request("/api/devices");
      this._myDevices = devices.map((device) => {
        const parsedResult = new UAParser(device.userAgent).getResult();
        return {
          ...device,
          type: parsedResult.device.type,
          description: `${parsedResult.browser.name} ${parsedResult.browser.version.split(".").shift()} :: ${
            parsedResult.os.name
          } ${parsedResult.os.version}`,
        };
      });
    } catch (error) {
      this._setNotificationMessage("Could not retrieve devices", "error");
    }
  }

  _getDeviceIcon(type) {
    switch (type) {
      case "mobile":
        return "📱";
      default:
        return "🖥️";
    }
  }

  async _deleteDevice(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const isCurrentDevice = formData.get("currentDevice") === "true";
    this._deviceIdToRemove = formData.get("id");

    if (isCurrentDevice) {
      this._isRemovingCurrentDevice = true;
    } else {
      this._continueDeleteDevice();
    }
  }

  async _continueDeleteDevice(event) {
    event?.preventDefault();

    const action = event?.submitter?.name;

    if (action === "cancel") {
      this._deviceIdToRemove = null;
      this._isRemovingCurrentDevice = false;
      return;
    }

    if (!action || action === "continue") {
      try {
        await request(`/api/devices/${this._deviceIdToRemove}`, { method: "DELETE" });
        this._setNotificationMessage("Device successfuly removed from account", "success");
        if (this._isRemovingCurrentDevice) {
          logout();
        } else {
          this._getMyDevices();
        }
      } catch (error) {
        this._setNotificationMessage("Could not remove device", "error");
      }
    }

    this._deviceIdToRemove = null;
  }

  async _onFeedbackSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const params = new URLSearchParams(`words=${formData.get("feedback")}`);

    try {
      await request(`/api/feedback?${params.toString()}`, { method: "PUT" });
      form.reset();
      this._setNotificationMessage("Feedback was successfully sent", "success");
    } catch (error) {
      this._setNotificationMessage("Could not send feedback", "error");
    }
  }
}

customElements.define("auth-dashboard", Dashboard);
