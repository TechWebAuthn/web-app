import { html, unsafeCSS } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import resets from "../styles/resets.css?inline";
import slides from "../styles/slides.css?inline";

class WebAuthnSupport extends PresentationPageTemplate {
  static get styles() {
    return [unsafeCSS(resets), unsafeCSS(slides)];
  }

  render() {
    return html`
      <h1>Web Authn - Platform support</h1>

      <article>
        <aside>
          <figure>
            <img src="/images/web-authn-support.png" alt="Devices" />
            <ficaption>
              <a href="https://www.freepik.com/vectors/technology"
                >Technology vector created by stories - www.freepik.com</a
              >
            </ficaption>
          </figure>
        </aside>
        <section>
          <figure>
            <img src="/images/fido2-support.png" alt="FIDO2 Support" />
            <ficaption> Data provided by FIDO Alliance </ficaption>
          </figure>
        </section>
      </article>
    `;
  }

  get _prompterMessage() {
    return `
      # Web Authn - Add a new device
    `;
  }
}

customElements.define("presentation-web-authn-support", WebAuthnSupport);
