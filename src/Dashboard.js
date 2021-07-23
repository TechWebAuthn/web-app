import { LitElement, html } from "lit";
import {
  card,
  code,
  notification,
  pageSubtitle,
  form,
  itemsRow,
  iconButton,
} from "../public/css/component.module.css";
import { request } from "./utils/network";
import { clearNotificationMessage, setNotificationMessage } from "./utils/notification";
import { logout, getSession } from "./utils/session";

class Dashboard extends LitElement {
  static get properties() {
    return {
      _registrationAddToken: String,
    };
  }

  createRenderRoot() {
    return this;
  }

  render() {
    const { username } = getSession();

    return html`
      <h2 class="${pageSubtitle}">Dashboard</h2>
      <p id="notification" class="${notification}"></p>
      <div class="${card}">
        <p>Welcome back, <strong>${username}</strong>!</p>
        <form class="${form}" @submit="${this._addNewDevice}">
          <button>Add new device</button>
        </form>
        ${this._registrationAddToken
          ? html`
              <p>This registration token is valid for 10 minutes:</p>
              <p class="${itemsRow}">
                <code class="${code}">${this._registrationAddToken}</code
                ><button
                  @click="${this._copyRegistrationAddTokenToClipboard}"
                  class="${iconButton}"
                >
                  📋
                </button>
              </p>
            `
          : ``}
        <form class="${form}" @submit="${logout}">
          <button data-type="danger">Logout</button>
        </form>
      </div>
    `;
  }

  async _addNewDevice(event) {
    event.preventDefault();

    try {
      const { registrationAddToken } = await request("/api/registration/add");
      this._registrationAddToken = registrationAddToken;
    } catch (error) {
      setNotificationMessage(error.message, "error");
    }
  }

  async _copyRegistrationAddTokenToClipboard() {
    await navigator.clipboard.writeText(this._registrationAddToken);
    setNotificationMessage("Registration token copied to clipboard", "info");
    setTimeout(clearNotificationMessage, 3000);
  }
}

customElements.define("auth-dashboard", Dashboard);
