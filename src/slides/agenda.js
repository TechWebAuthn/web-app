import { html, unsafeCSS, css } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import slides from "../styles/slides.css?inline";

class Agenda extends PresentationPageTemplate {
  static get styles() {
    return [
      unsafeCSS(slides),
      css`
        ol {
          font-size: 2.4rem;
          padding-inline-start: 4rem;
        }
        aside {
          flex: 2;
        }
      `,
    ];
  }

  render() {
    return html`
      <article>
        <h1>Agenda</h1>
        <section>
          <ol>
            <li>
              Authentication
              <ol>
                <li>What</li>
                <li>How</li>
                <li>Challenges</li>
              </ol>
            </li>
            <li>Asymetric cryptography (brief)</li>
            <li>
              Web Authentication
              <ol>
                <li>Introduction</li>
                <li>Ceremonies</li>
                <li>Registration</li>
                <li>Login</li>
                <li>Recovery</li>
                <li>Adding new devices</li>
                <li>Platform support</li>
              </ol>
            </li>
            <li>Resources</li>
          </ol>
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

      We'll deep-dive into each ceremony with a live demo to see how everything ties together, talk a bit about Web Authentication platform support and share some of our recommended resources on this topic.
    `;
  }
}

customElements.define("presentation-agenda", Agenda);
