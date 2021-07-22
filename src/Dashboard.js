import { LitElement, html } from "lit";
import { card, notification, pageSubtitle } from "../public/css/component.module.css";
import { logout, getSession } from "./utils/session";

class Dashboard extends LitElement {
  static get properties() {
    return {
      _username: String,
    };
  }

  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    this._username = getSession().username;
  }

  render() {
    return html`
      <h2 class="${pageSubtitle}">Dashboard</h2>
      <p id="notification" class="${notification}"></p>
      <div class="${card}">
        <p>Welcome back, ${this._username}!</p>
        <button @click="${logout}">Logout</button>
      </div>
    `;
  }
}

customElements.define("auth-dashboard", Dashboard);
