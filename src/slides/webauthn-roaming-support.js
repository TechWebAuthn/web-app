import { html, unsafeCSS } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import resets from "../styles/resets.css?inline";
import layouts from "../styles/layouts.css?inline";
import tables from "../styles/tables.css?inline";
import slides from "../styles/slides.css?inline";

class WebAuthnRoamingSupport extends PresentationPageTemplate {
  static get styles() {
    return [unsafeCSS(resets), unsafeCSS(layouts), unsafeCSS(tables), unsafeCSS(slides)];
  }

  render() {
    return html`
      <h1>WebAuthn - Browser roaming support</h1>

      <article>
        <section class="wide">
          <table class="grid">
            <thead>
              <tr>
                <th></th>
                <th>Android 7+</th>
                <th>iOS 14.5+</th>
                <th>Windows 10</th>
                <th>macOS Catalina</th>
                <th>macOS Big Sur</th>
                <th>Desktop Linux</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Chrome</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
              </tr>
              <tr>
                <td>Safari</td>
                <td>N/A</td>
                <td class="y">Yes</td>
                <td>N/A</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>Firefox</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
              </tr>
              <tr>
                <td>Brave</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
              </tr>
              <tr>
                <td>Edge</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
              </tr>
              <tr>
                <td>Internet Explorer</td>
                <td>N/A</td>
                <td>N/A</td>
                <td class="n">No</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>N/A</td>
              </tr>
            </tbody>
          </table>
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

      When it comes to roaming support, the compatibility table is almost entirely blue, with Internet Explorer and several unavailable combinations as exceptions.
    `;
  }
}

customElements.define("presentation-webauthn-roaming-support", WebAuthnRoamingSupport);
