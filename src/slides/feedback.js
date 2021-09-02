import { html, unsafeCSS, css } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import "../components/word-cloud-feedback";
import slides from "../styles/slides.css?inline";

class Feedback extends PresentationPageTemplate {
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
        <h1>Feedback</h1>
        <section>
          <word-cloud-feedback></word-cloud-feedback>
        </section>
      </article>
    `;
  }

  get _prompterMessage() {
    return `
      # Feedback

      If you have any thought about our presentation please leave them in the feedback form found in the Dashboard.
    `;
  }
}

customElements.define("presentation-feedback", Feedback);
