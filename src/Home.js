import { LitElement, html, unsafeCSS } from "lit";

import resets from "./styles/resets.css?inline";
import cards from "./styles/cards.css?inline";
import headings from "./styles/headings.css?inline";

class Home extends LitElement {
  static get styles() {
    return [unsafeCSS(resets), unsafeCSS(cards), unsafeCSS(headings)];
  }

  render() {
    return html`
      <h2 class="page-subtitle">Welcome!</h2>
      <div class="card">
        <p>
          This is a basic WebAuth application that makes use of WebRTC to enroll new devices easily, without the need
          for 3rd party apps or services.
        </p>
      </div>
    `;
  }
}

customElements.define("auth-home", Home);
