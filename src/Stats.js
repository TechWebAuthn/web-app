import { LitElement, html } from "lit";
import { notification, stats, card } from "../public/css/component.module.css";

const statsMap = {
  login: "Logged in",
  register: "Registered"
}

class Stats extends LitElement {
  constructor() {
    super();
    this.stats = { login: 0, register: 0 };
    this._statsDirection = { login: "⏳", register: "⏳" };
  }

  static get properties() {
    return {
      stats: Object,
    };
  }

  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    this.getStats();
  }

  disconnectedCallback() {
    this._sseConnection.close();
  }

  render() {
    return html`
      <h1>Stats</h1>
      <p id="status" class="${notification}"></p>
      <div class="${card}">
        <dl class="${stats}">
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
    this._sseConnection.addEventListener("register", this._updateStats.bind(this));
    this._sseConnection.onopen = () =>
      this._updateStatusMessage("Connection established", "success");
    this._sseConnection.onclose = () => this._updateStatusMessage("Connection closed", "info");
    this._sseConnection.onerror = () =>
      this._updateStatusMessage("Connection could not be established", "error");
  }

  _updateStats(event) {
    try {
      const newData = JSON.parse(event.data);
      this._updateStatsDirection({ ...this.stats }, newData, event.type);
      this.stats = { ...this.stats, ...newData };
    } catch (e) {
      this._updateStatusMessage("Something went wrong", "error");
    }
  }

  _updateStatusMessage(message, type) {
    const messageContainer = document.getElementById("status");
    messageContainer.textContent = message;
    messageContainer.dataset.type = type;
  }

  _updateStatsDirection(oldData, newData, eventType) {
    if (eventType === 'welcome') return;

    for (const stat in oldData) {
      this._statsDirection[stat] =
        newData[stat] > oldData[stat] ? "⬆️" : newData[stat] < oldData[stat] ? "⬇️" : "⏳";
    }
  }
}

customElements.define("auth-stats", Stats);
