import { html, unsafeCSS } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import slides from "../styles/slides.css?inline";

class AuthenticationHow extends PresentationPageTemplate {
  static get styles() {
    return [unsafeCSS(slides)];
  }

  render() {
    return html`
      <h1>Authentication - How does it work?</h1>

      <article>
        <aside>
          <figure>
            <img src="/images/authentication-how.png" alt="Authentication method" />
            <figcaption>
              <a href="https://www.freepik.com/vectors/computer"
                >Computer vector created by stories - www.freepik.com</a
              >
            </figcaption>
          </figure>
        </aside>
        <section>
          <h2>The three factors of authentication</h2>
          <ul>
            <li>Something you know</li>
            <li>Something you have</li>
            <li>Something you are</li>
          </ul>
        </section>
        <section>
          <h2>Some common types of authentication</h2>
          <ul>
            <li>Password-based</li>
            <li>Multi-factor</li>
            <li>Certificate-based</li>
            <li>Biometric</li>
            <li>Token-based</li>
          </ul>
        </section>
      </article>
    `;
  }
}

customElements.define("presentation-authentication-how", AuthenticationHow);
