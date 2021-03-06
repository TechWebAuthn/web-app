import { css, html, LitElement, unsafeCSS } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { marked } from "marked";
import { connectToBroadcastChannel } from "./utils/network";

import resets from "./styles/resets.css?inline";

class Prompter extends LitElement {
  constructor() {
    super();
    this._broadcastChannel = connectToBroadcastChannel("presentation");
    this._broadcastChannel.onmessage = this._parseMessage.bind(this);
    this._slideName = "...";
    this._slideText = "...";
    this._slideTimer = 0;
    this._timerInterval = null;
    this._isTimerOn = false;
  }

  static get properties() {
    return {
      _slideName: String,
      _slideText: String,
      _slideTimer: Number,
    };
  }

  static get styles() {
    return [
      unsafeCSS(resets),
      css`
        :host {
          font-size: 2rem;
          gap: 2rem;
          height: 100vh;
        }

        :host > * {
          max-width: 55ch;
          margin-inline-start: auto;
          margin-inline-end: auto;
        }

        div {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-size: 1.2em;
        }

        ul,
        ol {
          margin-inline-start: 1em;
          margin-block-end: 1em;
        }

        p {
          margin-block-end: 1em;
        }

        output {
          font-size: 2em;
        }
      `,
    ];
  }

  disconnectedCallback() {
    this._broadcastChannel.close();
  }

  render() {
    return html`
      <h1>${this._slideName}</h1>
      <div>${unsafeHTML(marked.parse(this._slideText))}</div>
      <output>${this._formatedTimer}</output>
    `;
  }

  _parseMessage({ data }) {
    if (data.endsWith("timer")) {
      if (data === "start-timer") {
        if (this._isTimerOn) {
          clearInterval(this._timerInterval);
          this._isTimerOn = false;
        } else {
          this._timerInterval = setInterval(this._countUp.bind(this), 1000);
          this._isTimerOn = true;
        }
      } else {
        clearInterval(this._timerInterval);
        this._slideTimer = 0;
        this._isTimerOn = false;
      }
      return;
    }

    const { name, text } = data?.match(/(?<name>^\s+\n?[#]+.+\n)(?<text>[\s\S]+$)/)?.groups || {};
    this._slideName = name?.replace(/(#)+/, "")?.trim() || this._slideName;
    this._slideText = text?.replace(/^(?!\n)\s+/gm, "").trim() || this._slideText;
  }

  _countUp() {
    this._slideTimer += 1;
  }

  get _formatedTimer() {
    return new Date(this._slideTimer * 1000)
      .toISOString()
      .match(/(?<=T)(.+)(?=\.)/)
      .pop();
  }
}

customElements.define("presentation-prompter", Prompter);
