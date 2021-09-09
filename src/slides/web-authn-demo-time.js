import { html, unsafeCSS, css } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import { setNotificationMessage } from "../utils/notification";
import "webauthn-components/registration";
import "../components/logs";
import "../components/gist";
import forms from "../styles/forms.css?inline";
import cards from "../styles/cards.css?inline";
import notifications from "../styles/notifications.css?inline";
import layouts from "../styles/layouts.css?inline";
import codes from "../styles/codes.css?inline";
import buttons from "../styles/buttons.css?inline";
import slides from "../styles/slides.css?inline";

class WebAuthnDemoTime extends PresentationPageTemplate {
  constructor() {
    super();

    this._setNotificationMessage = setNotificationMessage.bind(this);
  }

  static get properties() {
    return {};
  }

  static get styles() {
    return [
      unsafeCSS(forms),
      unsafeCSS(cards),
      unsafeCSS(notifications),
      unsafeCSS(layouts),
      unsafeCSS(codes),
      unsafeCSS(buttons),
      unsafeCSS(slides),
      css`
        article {
          margin-block-end: 4rem;
        }
      `,
    ];
  }

  render() {
    return html`
      <h1>WebAuthn - Demo time</h1>

      <article>
        <section class="column">
          <auth-gist data-gist-id="8eac08de0bde4ebefc6f65877000065a"></auth-gist>
        </section>
        <section class="column">
          <auth-gist data-gist-id="a3b0280dbd5ffd12340584903d193441"></auth-gist>
        </section>
      </article>
    `;
  }

  get _prompterMessage() {
    return `
      # Web Authn - Demo Time
      -
    `;
  }
}

customElements.define("presentation-web-authn-demo-time", WebAuthnDemoTime);
