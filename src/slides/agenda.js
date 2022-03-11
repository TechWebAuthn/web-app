import { html, unsafeCSS, css } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import slides from "../styles/slides.css?inline";

class Agenda extends PresentationPageTemplate {
  static get styles() {
    return [
      unsafeCSS(slides),
      css`
        ul {
          font-size: 3rem;
          padding-inline-start: 4rem;
        }
        aside {
          flex: 1;
        }
      `,
    ];
  }

  render() {
    return html`
      <h1>Agenda</h1>
      <article>
        <section>
          <ul>
            <li><b>Authentication</b> - What / How / Challenges</li>
            <li>
              <b>Web Authentication</b>
              <ul>
                <li>Asymmetric cryptography (brief)</li>
                <li>Introduction</li>
                <li>Ceremonies</li>
                <li>Platform support</li>
              </ul>
            </li>
            <li><b>Phishing use case (password vs. WebAuthn)</b></li>
            <li><b>Resources</b></li>
          </ul>
        </section>
        <aside>
          <figure>
            <img src="/images/agenda.png" alt="Agenda" />
            <figcaption>
              <a href="https://www.freepik.com/vectors/illustrations">Illustrations vector created by stories</a>
            </figcaption>
          </figure>
        </aside>
      </article>
    `;
  }

  get _prompterMessage() {
    return `
      # Agenda

      We'll start with a brief overview of authentication and talk about some of its challenges.

      A short reminder on asymmetric cryptography will accompany the introduction to Web Authentication, followed by an overview of the main ceremonies involved with this API.

      We'll deep-dive into each ceremony with a live demo to see how everything ties together and talk a bit about Web Authentication platform support.

      We'll also go over a phising attack, in which we'll compare password login and web authentication login, and close off with some of our recommended resources on Web Authentication'.
    `;
  }
}

customElements.define("presentation-agenda", Agenda);
