import { html, unsafeCSS, css } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import "../components/word-cloud-users";
import slides from "../styles/slides.css?inline";

class TryItOut extends PresentationPageTemplate {
  static get styles() {
    return [
      unsafeCSS(slides),
      css`
        section {
          min-height: 75vh;
          display: flex;
        }
      `,
    ];
  }

  render() {
    return html`
      <article>
        <h1>Try it out @ auth.marv.ro</h1>
        <section>
          <word-cloud-users></word-cloud-users>
        </section>
      </article>
    `;
  }

  get _prompterMessage() {
    return `
      # Try it out

      You can try Web Authentication API out right here, just go to auth.marv.ro
    `;
  }
}

customElements.define("presentation-try-it-out", TryItOut);
