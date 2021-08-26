import {css, html, LitElement, unsafeCSS} from "lit";
import slides from "../styles/slides.css?inline";
import {setNotificationMessage} from "../utils/notification";
import "web-authn-components/recovery";
import forms from "../styles/forms.css";
import cards from "../styles/cards.css";
import notifications from "../styles/notifications.css";

class WebAuthnIntro1 extends LitElement {
    constructor() {
        super();

        this._setNotificationMessage = setNotificationMessage.bind(this);
    }

    static get styles() {
        return [
            unsafeCSS(forms),
            unsafeCSS(cards),
            unsafeCSS(notifications),
            unsafeCSS(slides),
            css`
        web-authn-recovery::part(input) {
          box-sizing: border-box;
        }
      `,
        ];
    }

    render() {
        return html`
            <h1>Web Authn</h1>

            <article>
                <aside>
                    <figure>
                        <img src="/images/webauthn-intro-1.jpg" alt="WebAuthn Introduction" />
                        <figcaption>
                            <a href='https://www.freepik.com/vectors/infographic'>Infographic vector created by vectorjuice - www.freepik.com</a>
                        </figcaption>
<!--                        https://www.freepik.com/free-vector/access-control-system-abstract-concept_12085707.htm#page=1&query=password%20fingerprint&position=6-->
<!--                        https://www.freepik.com/free-vector/fingerprint-concept-illustration_9793215.htm#page=1&query=password%20fingerprint&position=2-->
                    </figure>
                </aside>
                <section>
                    <h2>A new standard enabling the creation and use of strong, attested, scoped, public key-based credentials by web apps</h2>
                    <h3>Actors</h3>
                    <ul>
                        <li>User</li>
                        <li>Authenticator</li>
                        <li>User Agent</li>
                        <li>Relying Party</li>
                    </ul>
                </section>
            </article>
        `;
    }
}

customElements.define("presentation-web-authn-intro-1", WebAuthnIntro1);
