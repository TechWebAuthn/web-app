import { html, unsafeCSS, css } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import resets from "../styles/resets.css?inline";
import layouts from "../styles/layouts.css?inline";
import slides from "../styles/slides.css?inline";

class WebAuthnRoamingSupport extends PresentationPageTemplate {
  static get styles() {
    return [
      unsafeCSS(resets),
      unsafeCSS(layouts),
      unsafeCSS(slides),
      css`
        figure img {
          height: 100%;
        }

        .column figure {
          max-width: 90%;
        }
      `,
    ];
  }

  render() {
    return html`
      <h1>WebAuthn - Browser roaming support</h1>

      <article>
        <section class="wide">
          <figure>
            <img src="/images/roaming-support.png" alt="WebAuthn roaming support" />
            <ficaption
              ><a href="https://webauthn.me/roaming-support" target="_blank">Browser roaming support</a></ficaption
            >
          </figure>
        </section>
        <aside>
          <figure>
            <img src="/images/webauthn-roaming-support.png" alt="Mobile" />
            <ficaption>
              <a href="https://www.freepik.com/vectors/technology">Technology vector created by stories</a>
            </ficaption>
          </figure>
        </aside>
      </article>
    `;
  }

  get _prompterMessage() {
    return `
      # Web Authn - Browser roaming support
    `;
  }
}

customElements.define("presentation-webauthn-roaming-support", WebAuthnRoamingSupport);
