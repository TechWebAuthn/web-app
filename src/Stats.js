import { LitElement, html } from "lit";
import { notification, stats } from "../public/css/component.module.css";

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

  render() {
    return html`
      <h1>Stats</h1>
      <p id="status" class="${notification}"></p>
      <dl class="${stats}">
        ${Object.keys(this.stats).map(
          (key) => html`
            <dt>${key}</dt>
            <dd>${this.stats[key]} <span>${this._statsDirection[key]}</span></dd>
          `
        )}
      </dl>
    `;
  }

  getStats() {
    const sse = new EventSource("https://auth.marv.ro/api/users", { withCredentials: true });
    sse.addEventListener("welcome", this._updateStats.bind(this));
    sse.addEventListener("login", this._updateStats.bind(this));
    sse.addEventListener("register", this._updateStats.bind(this));
    sse.onopen = () => this._updateStatusMessage("Connection established", "success");
    sse.onclose = () => this._updateStatusMessage("Connection closed", "close");
    sse.onerror = () => this._updateStatusMessage("Connection could not be established", "error");
  }

  _updateStats(event) {
    try {
      const newData = JSON.parse(event.data);
      this._updateStatsDirection({ ...this.stats }, newData);
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

  _updateStatsDirection(oldData, newData) {
    for (const stat in oldData) {
      this._statsDirection[stat] =
        newData[stat] > oldData[stat] ? "⬆️" : newData[stat] < oldData[stat] ? "⬇️" : "⏳";
    }
  }
}

customElements.define("auth-stats", Stats);
