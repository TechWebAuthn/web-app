import { LitElement } from "lit";
import { connectToBroadcastChannel } from "../utils/network";

export default class PresentationPageTemplate extends LitElement {
  constructor() {
    super();
    this._broadcastChannel = connectToBroadcastChannel("presentation");
    this._broadcastChannel?.postMessage(this._prompterMessage);
  }

  connectedCallback() {
    super.connectedCallback();

    if (sessionStorage.getItem(`revealed/${this.location.route.name}`)) {
      const styleSheet = new CSSStyleSheet();
      styleSheet.replaceSync("[data-reveal] { visibility: unset; }");
      this.shadowRoot.adoptedStyleSheets = [...this.shadowRoot.adoptedStyleSheets, styleSheet];
    }
  }

  firstUpdated() {
    if (!sessionStorage.getItem(`revealed/${this.location.route.name}`)) {
      const revealElements = this.shadowRoot.querySelectorAll("[data-reveal]");
      this._setupReveal(Array.from(revealElements));
    }

    super.firstUpdated();
  }

  get _prompterMessage() {
    return `
      Prompter Title

      Prompter help text line 1
      Prompter help text line 2
    `;
  }

  _setupReveal(elements) {
    if (elements.length) {
      this.closest("presentation-app").stopNavigation = true;

      window.onkeyup = (event) => {
        if (!elements.length) {
          return window.dispatchEvent(new KeyboardEvent("keyup", { code }));
        }

        event.preventDefault();
        event.stopImmediatePropagation();

        const { code } = event;
        if (!["ArrowLeft", "ArrowRight"].includes(code) || !elements.length) return;

        const element = elements.shift();
        delete element.dataset.reveal;

        if (!elements.length) {
          sessionStorage.setItem(`revealed/${this.location.route.name}`, true);
          this.closest("presentation-app").stopNavigation = false;
          window.onkeyup = null;
        }
      };
    }
  }
}
