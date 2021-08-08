import { Router } from "@vaadin/router";
import { LitElement, html, unsafeCSS, css } from "lit";
import "./components/theme-toggle";
import "./components/nav";
import { hasValidSession, isLoggedIn } from "./utils/session";
import links from "./styles/links.css";
import headings from "./styles/headings.css";

const router = new Router();

const routes = [
  {
    name: "home",
    path: "/",
    component: "auth-home",
    action: () => import("./Home.js"),
  },
  {
    name: "dashboard",
    path: "/dashboard",
    component: "auth-dashboard",
    action: (_ctx, cmd) => (isLoggedIn() ? import("./Dashboard") : cmd.redirect("/")),
  },
  {
    name: "login",
    path: "/login",
    component: "auth-login",
    action: (_ctx, cmd) => (isLoggedIn() ? cmd.redirect("/dashboard") : import("./Login")),
  },
  {
    name: "register",
    path: "/register",
    component: "auth-register",
    action: (_ctx, cmd) => (isLoggedIn() ? cmd.redirect("/dashboard") : import("./Register")),
  },
  {
    name: "stats",
    path: "/stats",
    component: "auth-stats",
    action: () => import("./Stats.js"),
  },
];

router.setRoutes(routes);

class AuthApp extends LitElement {
  constructor() {
    super();

    this.isLoggedIn = isLoggedIn();
    if (this.isLoggedIn) this._checkValidSession();
  }

  static get properties() {
    return {
      isLoggedIn: Boolean,
    };
  }

  static get styles() {
    return [
      unsafeCSS(links),
      unsafeCSS(headings),
      css`
        main > * {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        theme-toggle {
          display: flex;
          font-size: 1.5rem;
          position: absolute;
          top: 0;
          right: 0;
        }

        theme-toggle button {
          padding: 1rem;
          border: none;
          background-color: transparent;
          font-size: inherit;
        }
      `,
    ];
  }

  firstUpdated() {
    router.setOutlet(this.shadowRoot.querySelector("main"));
    window.addEventListener("session-changed", (event) => {
      this.isLoggedIn = event.detail.isLoggedIn;
    });
  }

  render() {
    return html`
      <a class="home-link" href="/">🏠</a>
      <theme-toggle></theme-toggle>
      <h1 class="page-title">WebAuthn ❤️ WebRTC</h1>
      <auth-nav .isLoggedIn="${this.isLoggedIn}"></auth-nav>
      <main></main>
    `;
  }

  async _checkValidSession() {
    this.isLoggedIn = await hasValidSession();
  }
}

customElements.define("auth-app", AuthApp);
