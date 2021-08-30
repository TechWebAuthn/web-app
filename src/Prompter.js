import { LitElement, html, unsafeCSS, css } from "lit";
import { connectToBroadcastChannel } from "./utils/network";

import resets from "./styles/resets.css?inline";

class Prompter extends LitElement {
  constructor() {
    super();
    this._broadcastChannel = connectToBroadcastChannel("presentation");
    this._broadcastChannel.onmessage = this._parseMessage.bind(this);
  }

  static get properties() {
    return {
      _slideName: String,
      _slideTexts: Array,
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

        div {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          font-size: 1.2em;
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
      <div>${this._slideTexts?.map((text) => html`<p>${text}</p>`)}</div>
    `;
  }

  _parseMessage({ data }) {
    const [name, text] = data?.split("\n\n").map((d) => d.trim());
    this._slideName = name;
    this._slideTexts = text?.split("\n").map((t) => t.trim()) || [];
  }
}

customElements.define("presentation-prompter", Prompter);
