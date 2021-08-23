import { LitElement, html, unsafeCSS } from "lit";
import slides from "../styles/slides.css?inline";

class AuthenticationChallenges extends LitElement {
  static get styles() {
    return [unsafeCSS(slides)];
  }

  render() {
    return html`
      <h1>Authentication - Challenges</h1>

      <article>
        <aside>
          <figure>
            <img src="/images/authentication-challenges.png" alt="Security concerns" />
            <figcaption>
              <a href="https://www.freepik.com/vectors/website">Website vector created by stories - www.freepik.com</a>
            </figcaption>
          </figure>
        </aside>
        <section>
          <h2>Password related problems</h2>
          <ul>
            <li>Stolen passwords</li>
            <li>Password reuse</li>
            <li>Weak password policies</li>
            <li>Password fatigue</li>
            <li>Phishing attacks</li>
            <li>Plain-text password storage</li>
            <li>Bad use of cryptography</li>
          </ul>
        </section>
      </article>
    `;
  }
}

customElements.define("presentation-authentication-challenges", AuthenticationChallenges);
