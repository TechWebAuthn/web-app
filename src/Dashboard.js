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
} from "../public/css/component.module.css";
import { request } from "./utils/network";
import { clearNotificationMessage, setNotificationMessage } from "./utils/notification";
import { logout, getSession } from "./utils/session";
import { WebRTCConnection, WebSocketConnection } from "./utils/webrtc";

class Dashboard extends LitElement {
  constructor() {
    super();

    this.RTC = null;
    this._myDevices = [];
    this._addDeviceInProgress = false;
  }

  static get properties() {
    return {
      _myDevices: Array,
      _addDeviceInProgress: Boolean,
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
              <ul class="${deviceList}">
                ${this._myDevices.map(
                  (device) =>
                    html`
                      <li>
                        ${device.userAgent}
                        <form @submit="${this._deleteDevice}" class="${form} ${inline}">
                          <input type="hidden" name="id" value=${device.id} />
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
      this._myDevices = await request("/api/devices");
    } catch (error) {
      console.info("Could not get devices");
    }
  }

  async _deleteDevice(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const id = formData.get("id");

    try {
      await request(`/api/devices/${id}`, { method: "DELETE" });
      setNotificationMessage("Device successfuly removed from account", "success");
      this._getMyDevices();
    } catch (error) {
      console.log(error);
      setNotificationMessage("Could not remove device", "error");
    }
  }

  async _copyRegistrationAddTokenToClipboard() {
    await navigator.clipboard.writeText(this._registrationAddToken);
    setNotificationMessage("Registration token copied to clipboard", "info");
    setTimeout(clearNotificationMessage, 3000);
  }
}

customElements.define("auth-dashboard", Dashboard);
