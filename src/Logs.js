import { LitElement, html, unsafeCSS } from "lit";
import { setNotificationMessage } from "./utils/notification";

import resets from "./styles/resets.css?inline";
import cards from "./styles/cards.css?inline";
import headings from "./styles/headings.css?inline";
import stats from "./styles/stats.css?inline";
import notifications from "./styles/notifications.css?inline";

export class Logs extends LitElement {
  constructor() {
    super();
    this.logs = [];
    this._setNotificationMessage = setNotificationMessage.bind(this);
  }

  static get properties() {
    return {
      logs: Array,
    };
  }

  static get styles() {
    return [unsafeCSS(resets), unsafeCSS(cards), unsafeCSS(headings), unsafeCSS(stats), unsafeCSS(notifications)];
  }

  disconnectedCallback() {
    this._sseConnection.close();
  }

  render() {
    return html`
<!--      <p id="notification" class="notification"></p>-->
      <div class="card" style="max-width: 200rem; overflow-y: scroll;height: 15rem;">
          ${
      this.logs.map(
            (key,value) => {
              console.log('render', key, value);
              return html`
                <p style="font-size: 1rem;">${key}</p>
              `
            }
          )}
          <div id="#bottom"></div>
      </div>
    `;
  }

  firstUpdated() {
    this.getLogs();
  }

  getLogs() {
    this._sseConnection = new EventSource("http://localhost:8080/logs", {
      withCredentials: true,
    });
    this._sseConnection.addEventListener("log", this._updateLogs.bind(this));
    this._sseConnection.onopen = () => this._setNotificationMessage("Connection established", "success", false);
    this._sseConnection.onclose = () => this._setNotificationMessage("Connection closed", "info", false);
    this._sseConnection.onerror = () =>
      this._setNotificationMessage("Connection could not be established", "error", false);
  }

  _updateLogs(event) {
    try {
      this.logs = [...this.logs, event.data];
      // this.logs.push(event.data);
    } catch (e) {
      this._setNotificationMessage("Something went wrong", "error");
    }
  }
}

customElements.define("auth-logs", Logs);
