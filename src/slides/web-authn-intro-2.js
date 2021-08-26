import {css, html, LitElement, unsafeCSS} from "lit";
import slides from "../styles/slides.css?inline";
import {setNotificationMessage} from "../utils/notification";
import "web-authn-components/recovery";
import forms from "../styles/forms.css";
import cards from "../styles/cards.css";
import notifications from "../styles/notifications.css";

class WebAuthnIntro2 extends LitElement {
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
            <h1>???Web Authn???</h1>

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
                    <h2>Ceremonies</h2>
                    <ul>
                        <li>Registration - associate user accounts with credentials</li>
                        <li>Authentication - user credentials to login users </li>
                        <li>Account Recovery</li>
                        <li>Add more device</li>
                    </ul>
                </section>
            </article>
        `;
    }
}

customElements.define("presentation-web-authn-intro-2", WebAuthnIntro2);
