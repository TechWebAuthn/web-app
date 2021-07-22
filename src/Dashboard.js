import { LitElement, html } from "lit";
import { card, notification, pageSubtitle } from "../public/css/component.module.css";

class Dashboard extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <h2 class="${pageSubtitle}">Dashboard</h2>
      <p id="notification" class="${notification}"></p>
      <div class="${card}">
        <p>Welcome back, username!</p>
      </div>
    `;
  }
}

customElements.define("auth-dashboard", Dashboard);
