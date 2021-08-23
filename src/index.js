import { Router } from "@vaadin/router";
import { LitElement, html, unsafeCSS, css } from "lit";
import "./components/theme-toggle";
import "./components/nav";
import { hasValidSession, isLoggedIn } from "./utils/session";
import links from "./styles/links.css?inline";
import headings from "./styles/headings.css?inline";
import { routes as presentationRoutes } from "./Presentation";

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
    action: () => import("./Stats"),
  },
  {
    name: "presentation",
    path: "/presentation",
    component: "presentation-app",
    action: () => import("./Presentation"),
    children: presentationRoutes,
  },
];

router.setRoutes(routes);

class AuthApp extends LitElement {
  constructor() {
    super();

    this.isLoggedIn = isLoggedIn();
    if (this.isLoggedIn) this._checkValidSession();

    this.isInPresentationMode = window.location.pathname.startsWith("/presentation");
    window.addEventListener("vaadin-router-location-changed", () => {
      this.isInPresentationMode = window.location.pathname.startsWith("/presentation");
    });
  }

  static get properties() {
    return {
      isLoggedIn: Boolean,
      isInPresentationMode: Boolean,
    };
  }

  static get styles() {
    return [
      unsafeCSS(links),
      unsafeCSS(headings),
      css`
        main > *:not(presentation-app) {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-block-end: 4rem;
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
      if (!this.isInPresentationMode) {
        Router.go("/dashboard");
      }
    });
  }

  render() {
    return html`
      ${!this.isInPresentationMode
        ? html`
            <a class="home-link" href="/">🏠</a>
            <h1 class="page-title">WebAuthn ❤️ WebRTC</h1>
            <auth-nav .isLoggedIn="${this.isLoggedIn}"></auth-nav>
          `
        : ""}
      <theme-toggle></theme-toggle>
      <main></main>
    `;
  }

  async _checkValidSession() {
    this.isLoggedIn = await hasValidSession();
  }
}

customElements.define("auth-app", AuthApp);
