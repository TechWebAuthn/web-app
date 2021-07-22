import { LitElement, html } from "lit";
import { card, pageSubtitle } from "../public/css/component.module.css";

class Home extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <h2 class="${pageSubtitle}">Welcome!</h2>
      <div class="${card}">
        <p>
          This is a basic WebAuth application that makes use of WebRTC to enroll new devices easily,
          without the need for 3rd party apps or services.
        </p>
      </div>
    `;
  }
}

customElements.define("auth-home", Home);
