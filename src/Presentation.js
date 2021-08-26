import { LitElement, html, unsafeCSS } from "lit";
import { Router } from "@vaadin/router";
import resets from "./styles/resets.css?inline";
import presentation from "./styles/presentation.css?inline";

export const routes = [
  {
    name: "index",
    path: "/",
    redirect: "/presentation/cover",
  },
  {
    name: "cover",
    path: "/cover",
    component: "presentation-cover",
    action: () => import("./slides/cover"),
  },
  {
    name: "authentication",
    path: "/authentication",
    component: "presentation-authentication",
    action: () => import("./slides/authentication"),
  },
  {
    name: "authentication-how",
    path: "/authentication-how",
    component: "presentation-authentication-how",
    action: () => import("./slides/authentication-how"),
  },
  {
    name: "authentication-challenges",
    path: "/authentication-challenges",
    component: "presentation-authentication-challenges",
    action: () => import("./slides/authentication-challenges"),
  },
  {
    name: "web-authn-intro-1",
    path: "/web-authn-intro-1",
    component: "presentation-web-authn-intro-1",
    action: () => import("./slides/web-authn-intro-1"),
  },
  {
    name: "web-authn-asymmetric-intro",
    path: "/web-authn-asymmetric-intro",
    component: "presentation-web-authn-asymmetric-intro",
    action: () => import("./slides/web-authn-asymmetric-intro"),
  },
  {
    name: "web-authn-intro-2",
    path: "/web-authn-intro-2",
    component: "presentation-web-authn-intro-2",
    action: () => import("./slides/web-authn-intro-2"),
  },
  {
    name: "web-authn-register",
    path: "/web-authn-register",
    component: "presentation-web-authn-register",
    action: () => import("./slides/web-authn-register"),
  },
  {
    name: "web-authn-authentication",
    path: "/web-authn-authentication",
    component: "presentation-web-authn-authentication",
    action: () => import("./slides/web-authn-authentication"),
  },
  {
    name: "web-authn-recover",
    path: "/web-authn-recover",
    component: "presentation-web-authn-recover",
    action: () => import("./slides/web-authn-recover"),
  },
  {
    name: "web-authn-add-new",
    path: "/web-authn-add-new",
    component: "presentation-web-authn-add-new",
    action: () => import("./slides/web-authn-add-new"),
  },
  {
    name: "web-authn-support",
    path: "/web-authn-support",
    component: "presentation-web-authn-support",
    action: () => import("./slides/web-authn-support"),
  },
];

class PresentationApp extends LitElement {
  constructor() {
    super();

    this.isDarkTheme = window.localStorage.getItem("theme") === "dark";
    window.addEventListener("theme-changed", ({ detail: { theme } }) => (this.isDarkTheme = theme === "dark"));
    this._navigationListener = this._onNavigation.bind(this);
  }

  static get properties() {
    return {
      isDarkTheme: Boolean,
    };
  }

  static get styles() {
    return [unsafeCSS(resets), unsafeCSS(presentation)];
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keyup", this._navigationListener);
  }

  render() {
    return html`
      <slot></slot>
      <footer>
        <img ?hidden="${!this.isDarkTheme}" loading="lazy" src="/images/ing-logo-dark.svg" alt="ING logo" />
        <img ?hidden="${this.isDarkTheme}" loading="lazy" src="/images/ing-logo-bright.svg" alt="ING logo" />
      </footer>
    `;
  }

  disconnectedCallback() {
    window.removeEventListener("keyup", this._navigationListener);
    super.disconnectedCallback();
  }

  _onNavigation(event) {
    const { key } = event;
    if (!["ArrowLeft", "ArrowRight"].includes(key)) return;
    const currentSlide = this.location.pathname.replace("/presentation", "");
    const routeIndex = routes.findIndex((r) => r.path === currentSlide);
    if (key === "ArrowLeft" && routeIndex > 0) {
      Router.go(`/presentation${routes[routeIndex - 1].path}`);
    }
    if (key === "ArrowRight" && routeIndex < routes.length - 1) {
      Router.go(`/presentation${routes[routeIndex + 1].path}`);
    }
  }
}

customElements.define("presentation-app", PresentationApp);
