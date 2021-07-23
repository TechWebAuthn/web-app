import { Router } from "@vaadin/router";
import { LitElement, html } from "lit";
import "./components/theme-toggle";
import "./components/nav";
import { hasValidSession, isLoggedIn } from "./utils/session";
import { themeToggle, page, homeLink, pageTitle } from "../public/css/component.module.css";

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

  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    router.setOutlet(this.querySelector("main"));
    window.addEventListener("session-changed", (event) => {
      this.isLoggedIn = event.detail.isLoggedIn;
    });
  }

  render() {
    return html`
      <a class="${homeLink}" href="/">🏠</a>
      <theme-toggle class="${themeToggle}"></theme-toggle>
      <h1 class="${pageTitle}">WebAuth ❤️ WebRTC</h1>
      <auth-nav .isLoggedIn="${this.isLoggedIn}"></auth-nav>
      <main class="${page}"></main>
    `;
  }

  async _checkValidSession() {
    this.isLoggedIn = await hasValidSession();
  }
}

customElements.define("auth-app", AuthApp);
