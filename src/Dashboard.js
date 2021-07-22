import { LitElement, html } from "lit";
import { card, notification, pageSubtitle, form } from "../public/css/component.module.css";
import { logout, getSession } from "./utils/session";

class Dashboard extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    const { username } = getSession();

    return html`
      <h2 class="${pageSubtitle}">Dashboard</h2>
      <p id="notification" class="${notification}"></p>
      <div class="${card}">
        <p>Welcome back, ${username}!</p>
        <form class="${form}" @submit="${logout}">
          <button data-type="danger">Logout</button>
        </form>
      </div>
    `;
  }
}

customElements.define("auth-dashboard", Dashboard);
