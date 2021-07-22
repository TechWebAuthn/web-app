import { LitElement, html } from "lit";
import { link, nav } from "../../public/css/component.module.css";

class AuthNav extends LitElement {
  static get properties() {
    return {
      isLoggedIn: Boolean,
    };
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add(nav);
    window.addEventListener("popstate", () => {
      this._setActiveLink(window.location.pathname);
    });
  }

  firstUpdated() {
    this._setActiveLink(window.location.pathname);
  }

  render() {
    return html`
      <nav>
        <ul>
          ${this.isLoggedIn
            ? html`<li><a class="${link}" href="/dashboard">🎛️ Dashboard</a></li>`
            : html`
                <li><a class="${link}" href="/login">🔑 Login</a></li>
                <li><a class="${link}" href="/register">🚪 Register</a></li>
              `}
          <li><a class="${link}" href="/stats">📈 Stats</a></li>
        </ul>
      </nav>
    `;
  }

  _setActiveLink(path) {
    const links = this.querySelectorAll("a[href]");
    links.forEach((link) => {
      if (new URL(link.href).pathname === path) link.dataset.active = "";
      else delete link.dataset.active;
    });
  }
}

customElements.define("auth-nav", AuthNav);
