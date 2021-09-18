import { html, unsafeCSS } from "lit";
import PresentationPageTemplate from "./presentation-page-template";
import resets from "../styles/resets.css?inline";
import layouts from "../styles/layouts.css?inline";
import tables from "../styles/tables.css?inline";
import slides from "../styles/slides.css?inline";

class WebAuthnPlatformSupport extends PresentationPageTemplate {
  static get styles() {
    return [unsafeCSS(resets), unsafeCSS(layouts), unsafeCSS(tables), unsafeCSS(slides)];
  }

  render() {
    return html`
      <h1>WebAuthn - Browser platform support</h1>

      <article>
        <section class="wide">
          <table class="grid">
            <thead>
              <tr>
                <th></th>
                <th>Android 7+</th>
                <th>iOS 14.5+</th>
                <th>Windows 10 <small>(with Windows Hello)</small></th>
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
                <td>-</td>
              </tr>
              <tr>
                <td>Safari</td>
                <td>N/A</td>
                <td class="y">Yes</td>
                <td>N/A</td>
                <td class="n">No</td>
                <td class="y">Yes</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>Firefox</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td class="n">No</td>
                <td class="n">No</td>
                <td>-</td>
              </tr>
              <tr>
                <td>Brave</td>
                <td class="n">No</td>
                <td class="n">No</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td>-</td>
              </tr>
              <tr>
                <td>Edge</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td class="y">Yes</td>
                <td class=>-</td>
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
            <img src="/images/webauthn-platform-support.png" alt="Devices" />
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
      # Web Authn - Add a new device
    `;
  }
}

customElements.define("presentation-webauthn-platform-support", WebAuthnPlatformSupport);
