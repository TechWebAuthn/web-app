import { html, unsafeCSS } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import slides from "../styles/slides.css?inline";

class AuthenticationChallenges extends PresentationPageTemplate {
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
              <a href="https://www.freepik.com/vectors/website">Website vector created by stories</a>
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
          <p>
            <a href="https://www.varonis.com/blog/data-breach-statistics/" target="_blank">
              📊 98 Must-Know Data Breach Statistics for 2021
            </a>
          </p>
          <p>
            <a href="https://haveibeenpwned.com/" target="_blank"
              >🕵️ Check if your email or phone is in a data breach</a
            >
          </p>
        </section>
      </article>
    `;
  }

  get _prompterMessage() {
    return `
      # Authentication - Challenges

      Recent studies and reports show that compromised credentials cause as many as 80% of data breaches.

      Brute-force attacks, phishing, weak password policies, application vulnerabilities are only some of the causes leading to credential theft.

      Authentication factors have different weaknesses, and the industry advises using several of them in combination to ensure good security.

      Let's see which of these challenges can Web Authentication help solve.
    `;
  }
}

customElements.define("presentation-authentication-challenges", AuthenticationChallenges);
