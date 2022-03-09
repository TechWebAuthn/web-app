import { LitElement, html, unsafeCSS, css } from "lit";

import resets from "../styles/resets.css?inline";
import cards from "../styles/cards.css?inline";

export class Logs extends LitElement {
  constructor() {
    super();
    this.logs = [];
    this._autoScroll = true;
  }

  static get properties() {
    return {
      logs: Array,
      _autoScroll: Boolean,
    };
  }

  static get styles() {
    return [
      unsafeCSS(resets),
      unsafeCSS(cards),
      css`
        :host {
          display: flex;
          height: 100%;
          font-size: 1.75rem;
        }
        .card {
          margin: 0;
          max-width: 100%;
          max-height: 72vh;
          overflow: auto;
          scroll-behavior: smooth;
          position: relative;
          padding-top: 0;
        }
        .heading {
          font-weight: bold;
        }
        .class {
          color: var(--text-link);
        }
        .action {
          color: var(--text-link-active);
        }
        pre {
          white-space: normal;
          background-color: var(--canvas-primary);
          padding: 0.5rem;
        }
        code {
          word-break: break-word;
        }
        .scroll {
          font-size: 1rem;
        }
        h2 {
          display: flex;
          justify-content: space-between;
          padding: 1rem 2rem;
          position: sticky;
          top: 0;
          background: var(--canvas-secondary);
          left: 0px;
          align-items: baseline;
          margin-inline-end: -4rem;
          transform: translateX(-2rem);
        }
        .log-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        button {
          padding: 0.25rem 0.5rem;
          background: var(--button-canvas-primary);
          color: var(--button-text-primary);
          border: none;
        }
      `,
    ];
  }

  disconnectedCallback() {
    this._sseConnection.close();
  }

  render() {
    return html`
      <div class="card">
        <h2>
          Logs
          <span class="log-actions">
            <button @click="${this._clearLogs}">Clear</button>
            <label class="scroll">
              <input type="checkbox" @change="${this._toggleAutoScroll}" ?checked="${this._autoScroll}" />
              Auto scroll
            </label>
          </span>
        </h2>
        <ol>
          ${this.logs.map(
            (log) => html`
              <li>
                <div class="heading">
                  <span class="class">${log.class}</span> :: <span class="action">${log.action}</span>
                </div>
                <pre>
                  <code>
                    ${log.message}
                  </code>
                </pre>
              </li>
            `
          )}
        </ol>
      </div>
    `;
  }

  firstUpdated() {
    this.getLogs();
  }

  getLogs() {
    this._sseConnection = new EventSource("/api/logs", {
      withCredentials: true,
    });
    this._sseConnection.addEventListener("log", this._updateLogs.bind(this));
  }

  _updateLogs(event) {
    let log;

    try {
      const jsonData = JSON.parse(event.data);
      const messageSlices = jsonData.message.split("-");
      log = {
        class: jsonData.class,
        action: messageSlices.shift().trim(),
        message: messageSlices.join("").trim(),
      };
    } catch (error) {
      log = event.data;
    }

    this.logs = [...this.logs, log];
    if (this._autoScroll) {
      this._scrollLogs();
    }
  }

  _scrollLogs() {
    const card = this.shadowRoot.querySelector(".card");
    requestAnimationFrame(() => {
      card.scrollTo({ top: card.scrollHeight });
    });
  }

  _toggleAutoScroll(event) {
    this._autoScroll = event.target.checked;
  }

  _clearLogs() {
    this.logs = [];
  }
}

customElements.define("auth-logs", Logs);
