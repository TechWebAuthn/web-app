import { LitElement, html, unsafeCSS } from "lit";
import { setNotificationMessage } from "./utils/notification";

import resets from "./styles/resets.css";
import cards from "./styles/cards.css";
import headings from "./styles/headings.css";
import stats from "./styles/stats.css";
import notifications from "./styles/notifications.css";

const statsMap = {
  login: "Logged in",
  register: "Registered",
};

class Stats extends LitElement {
  constructor() {
    super();
    this.stats = { login: 0, register: 0 };
    this._statsDirection = { login: "⏳", register: "⏳" };
    this._setNotificationMessage = setNotificationMessage.bind(this);
  }

  static get properties() {
    return {
      stats: Object,
    };
  }

  static get styles() {
    return [
      unsafeCSS(resets),
      unsafeCSS(cards),
      unsafeCSS(headings),
      unsafeCSS(stats),
      unsafeCSS(notifications),
    ];
  }

  firstUpdated() {
    this.getStats();
  }

  disconnectedCallback() {
    this._sseConnection.close();
  }

  render() {
    return html`
      <h2 class="page-subtitle">Stats</h2>
      <p id="notification" class="notification"></p>
      <div class="card">
        <dl class="stats">
          ${Object.keys(this.stats).map(
            (key) => html`
              <dt>${statsMap[key]}</dt>
              <dd>${this.stats[key]} <span>${this._statsDirection[key]}</span></dd>
            `
          )}
        </dl>
      </div>
    `;
  }

  getStats() {
    this._sseConnection = new EventSource("https://auth.marv.ro/api/users", {
      withCredentials: true,
    });
    this._sseConnection.addEventListener("welcome", this._updateStats.bind(this));
    this._sseConnection.addEventListener("login", this._updateStats.bind(this));
    this._sseConnection.addEventListener("logout", this._updateStats.bind(this));
    this._sseConnection.addEventListener("register", this._updateStats.bind(this));
    this._sseConnection.onopen = () =>
      this._setNotificationMessage("Connection established", "success", false);
    this._sseConnection.onclose = () =>
      this._setNotificationMessage("Connection closed", "info", false);
    this._sseConnection.onerror = () =>
      this._setNotificationMessage("Connection could not be established", "error", false);
  }

  _updateStats(event) {
    try {
      const newData = JSON.parse(event.data);
      this._updateStatsDirection({ ...this.stats }, newData, event.type);
      this.stats = { ...this.stats, ...newData };
    } catch (e) {
      this._setNotificationMessage("Something went wrong", "error");
    }
  }

  _updateStatsDirection(oldData, newData, eventType) {
    if (eventType === "welcome") return;

    for (const stat in oldData) {
      this._statsDirection[stat] =
        newData[stat] > oldData[stat] ? "⬆️" : newData[stat] < oldData[stat] ? "⬇️" : "⏳";
    }
  }
}

customElements.define("auth-stats", Stats);
