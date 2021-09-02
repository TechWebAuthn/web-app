import { LitElement, html, unsafeCSS, css } from "lit";
import "./components/word-cloud-feedback";
import { setNotificationMessage } from "./utils/notification";

import resets from "./styles/resets.css?inline";
import cards from "./styles/cards.css?inline";
import headings from "./styles/headings.css?inline";
import stats from "./styles/stats.css?inline";
import notifications from "./styles/notifications.css?inline";
import layouts from "./styles/layouts.css?inline";
import loaders from "./styles/loaders.css?inline";

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
      _feedbackLoaded: Boolean,
    };
  }

  static get styles() {
    return [
      unsafeCSS(resets),
      unsafeCSS(cards),
      unsafeCSS(headings),
      unsafeCSS(stats),
      unsafeCSS(notifications),
      unsafeCSS(layouts),
      unsafeCSS(loaders),
    ];
  }

  firstUpdated() {
    this._getStats();
  }

  disconnectedCallback() {
    this._statsSSEConnection.close();
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
      <div class="expandable card center column">
        <button @click="${this._toggleFullscreen}" class="expand">&#x26F6;</button>
        <h3>Feedback</h3>
        <word-cloud-feedback></word-cloud-feedback>
      </div>
    `;
  }

  _getStats() {
    this._statsSSEConnection = new EventSource("/api/users", {
      withCredentials: true,
    });
    this._statsSSEConnection.addEventListener("welcome", this._updateStats.bind(this));
    this._statsSSEConnection.addEventListener("login", this._updateStats.bind(this));
    this._statsSSEConnection.addEventListener("logout", this._updateStats.bind(this));
    this._statsSSEConnection.addEventListener("register", this._updateStats.bind(this));
    this._statsSSEConnection.onopen = () => this._setNotificationMessage("Connection established", "success", false);
    this._statsSSEConnection.onclose = () => this._setNotificationMessage("Connection closed", "info", false);
    this._statsSSEConnection.onerror = () =>
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
      this._statsDirection[stat] = newData[stat] > oldData[stat] ? "⬆️" : newData[stat] < oldData[stat] ? "⬇️" : "⏳";
    }
  }

  _toggleFullscreen(event) {
    const parent = event.target.parentElement;
    parent.classList.toggle("fullscreen");
  }
}

customElements.define("auth-stats", Stats);
