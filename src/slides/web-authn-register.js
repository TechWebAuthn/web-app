import {css, html, LitElement, unsafeCSS} from "lit";
import slides from "../styles/slides.css?inline";
import {setNotificationMessage} from "../utils/notification";
import "web-authn-components/registration";
import {Logs} from "../Logs";
import forms from "../styles/forms.css";
import cards from "../styles/cards.css";
import notifications from "../styles/notifications.css";

class WebAuthnRegister extends LitElement {
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
            <h1>Web Authn - register</h1>

            <article>
                <aside class="fit-content">
                    <output class="device">
                        <h2>Register</h2>
                        <p id="notification" class="notification"></p>
                        <div class="card">
                            <web-authn-registration
                                    class="form"
                            ></web-authn-registration>
                        </div>
                    </output>
                </aside>
                <section>
                    <h2>How the Relying Party associates a (new) user account with new credentials</h2>
                    <h4>Backend</h4>
                    <auth-logs></auth-logs>
                </section>
            </article>
        `;
    }
}

customElements.define("presentation-web-authn-register", WebAuthnRegister);
