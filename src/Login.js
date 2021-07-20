import { LitElement, html } from "lit";
import { card, form } from "../public/css/component.module.css";

class Login extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`<h1>Login</h1>
      <div class="${card}">
        <form class="${form}">
          <label for="username">
            Username
            <input type="text" id="username" name="username" required />
          </label>
          <button type="submit">Login</button>
        </form>
      </div>`;
  }
}

customElements.define("auth-login", Login);
