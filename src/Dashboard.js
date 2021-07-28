import { LitElement, html } from "lit";
import {
  card,
  codeInput,
  notification,
  pageSubtitle,
  form,
  highlight,
  deviceList,
  inline,
  loader,
  center,
  row,
} from "../public/css/component.module.css";
import { request } from "./utils/network";
import { setNotificationMessage } from "./utils/notification";
import { logout, getSession } from "./utils/session";
import { WebRTCConnection, WebSocketConnection } from "./utils/webrtc";

class Dashboard extends LitElement {
  constructor() {
    super();

    this.RTC = null;
    this._myDevices = [];
    this._addDeviceInProgress = false;
    this._isRemovingCurrentDevice = false;
    this._deviceIdToRemove = null;
  }

  static get properties() {
    return {
      _myDevices: Array,
      _addDeviceInProgress: Boolean,
      _isRemovingCurrentDevice: Boolean,
    };
  }

  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    this._getMyDevices();
  }

  render() {
    const { username } = getSession();

    return html`
      <h2 class="${pageSubtitle}">Dashboard</h2>
      <p id="notification" class="${notification}"></p>
      <div class="${card}">
        <h3>Welcome back, <strong class="${highlight}">${username}</strong>!</h3>
        ${this._myDevices.length
          ? html`
              <h4>Registered devices</h4>
              ${this._isRemovingCurrentDevice
                ? html`
                    <p data-type="error" class="${notification}">
                      You are about to remove the current device and will be imediately logged out!
                    </p>
                    <form class="${form} ${row}" @submit=${this._continueDeleteDevice}>
                      <button name="continue">Continue</button>
                      <button name="cancel" data-type="danger">Cancel</button>
                    </form>
                  `
                : ``}
              <ul class="${deviceList}">
                ${this._myDevices.map(
                  (device) =>
                    html`
                      <li>
                        <span data-type="icon">${this._getDeviceIcon(device.type)}</span>
                        <span data-type="label">${device.description}</span>
                        <form @submit="${this._deleteDevice}" class="${form} ${inline}">
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
        <details>
          <summary>Enroll new device</summary>
          ${!this._addDeviceInProgress
            ? html`
                <form class="${form}" @submit="${this._addNewDevice}">
                  <label for="code">Code</label>
                  <input class="${codeInput}" id="code" name="code" type="text" required />
                  <button>Connect</button>
                </form>
              `
            : html`
                <div class="${center}">
                  <progress class="${loader}" indefinite>Loading</progress>
                </div>
              `}
        </details>
        <form class="${form}" @submit="${logout}">
          <button data-type="danger">Logout</button>
        </form>
      </div>
    `;
  }

  async _addNewDevice(event) {
    event.preventDefault();

    this.RTC?.close();

    const formData = new FormData(event.target);
    const rawCode = formData.get("code");
    const code = rawCode.toUpperCase();

    this._addDeviceInProgress = true;

    this.RTC = new WebRTCConnection(new WebSocketConnection("/api/socket"));
    this.RTC.listenForData();
    this.RTC.signaling.send({ code });

    this.RTC.ondatachannelmessage = async (event) => {
      const [type, data] = event.data.split("::");

      if (type === "action" && data === "add") {
        try {
          const { registrationAddToken } = await request("/api/registration/add");
          this.RTC.sendData(`token::${registrationAddToken}`);
        } catch (error) {
          setNotificationMessage(error.message, "error");
        }
      }

      if (type === "action" && data === "cancel") {
        this._addDeviceInProgress = false;
        setNotificationMessage("The other end cancelled the add device process", "error");
      }

      if (type === "event" && data === "complete") {
        this._addDeviceInProgress = false;
        this._getMyDevices();
        setNotificationMessage("A device was successfuly added to this account", "success");
      }
    };
  }

  async _getMyDevices() {
    try {
      const devices = await request("/api/devices");
      this._myDevices = devices.map((device) => {
        const [type, description] = device.userAgent.split(" || ");
        console.log(type, description);
        return {
          ...device,
          type,
          description,
        };
      });
    } catch (error) {
      setNotificationMessage("Could not retrieve devices", "error");
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
        setNotificationMessage("Device successfuly removed from account", "success");
        if (this._isRemovingCurrentDevice) {
          logout();
        } else {
          this._getMyDevices();
        }
      } catch (error) {
        setNotificationMessage("Could not remove device", "error");
      }
    }

    this._deviceIdToRemove = null;
  }
}

customElements.define("auth-dashboard", Dashboard);
