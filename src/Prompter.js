import { LitElement, html, unsafeCSS, css } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html";
import marked from "marked";
import { connectToBroadcastChannel } from "./utils/network";

import resets from "./styles/resets.css?inline";

class Prompter extends LitElement {
  constructor() {
    super();
    this._broadcastChannel = connectToBroadcastChannel("presentation");
    this._broadcastChannel.onmessage = this._parseMessage.bind(this);
    this._slideName = "...";
    this._slideText = "...";
  }

  static get properties() {
    return {
      _slideName: String,
      _slideText: String,
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

        p {
          margin-block-end: 2em;
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
      <div>${unsafeHTML(marked(this._slideText))}</div>
    `;
  }

  _parseMessage({ data }) {
    const { name, text } = data?.match(/(?<name>^\s+\n?[#]+.+\n)(?<text>[\s\S]+$)/)?.groups || {};
    this._slideName = name?.replace(/(#)+/, "")?.trim() || this._slideName;
    this._slideText = text?.replace(/^(?!\n)\s+/gm, "").trim() || this._slideText;
  }
}

customElements.define("presentation-prompter", Prompter);
