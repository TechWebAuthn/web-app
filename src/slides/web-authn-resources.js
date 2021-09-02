import {css, html, LitElement, unsafeCSS} from "lit";
import slides from "../styles/slides.css?inline";
import {setNotificationMessage} from "../utils/notification";
import forms from "../styles/forms.css";
import cards from "../styles/cards.css";
import notifications from "../styles/notifications.css";

class WebAuthnResources extends LitElement {
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
    static get scopedElements() {
        return {
            ...super.scopedElements,
            'auth-logs': Logs,
        };
    }

    render() {
        return html`
            <h1>Web Authn - resources</h1>
            <article>
                <aside>
                    <figure>
                        <img src="/images/webauthn-intro-1.png" alt="WebAuthn Resources" />
                        <figcaption>
                            <a href='https://www.freepik.com/vectors/infographic'>Infographic vector created by vectorjuice - www.freepik.com</a>
                        </figcaption>
                    </figure>
                </aside>
                <section>
                    <h2>You can use it too</h2>
                    <ul>
                        <li>https://github.com/TechWebAuthn</li>
                        <li>twitter.com/BogdanArvinte</li>
                        <li>mihaita-tinta.medium.com </li>
                    </ul>
                </section>
            </article>
        `;
    }
}

customElements.define("presentation-web-authn-resources", WebAuthnResources);
