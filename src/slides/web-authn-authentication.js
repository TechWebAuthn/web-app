import {css, html, LitElement, unsafeCSS} from "lit";
import slides from "../styles/slides.css?inline";
import {setNotificationMessage} from "../utils/notification";
import "web-authn-components/login";
import forms from "../styles/forms.css";
import cards from "../styles/cards.css";
import notifications from "../styles/notifications.css";
import {hasValidSession} from "../utils/session";

class WebAuthnAuthentication extends LitElement {
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
            <h1>Web Authn - authentication</h1>

            <article>
                <aside class="fit-content">
                    <output class="device">
                        <h2>Login</h2>
                        <p id="notification" class="notification"></p>
                        <div class="card">
                            <web-authn-login
                                    class="form"
                                    @login-started="${this._onWebAuthnLoginEvent}"
                                    @login-retrieved="${this._onWebAuthnLoginEvent}"
                                    @login-finished="${this._onWebAuthnLoginEvent}"
                                    @login-error="${this._onWebAuthnLoginEvent}"
                            ></web-authn-login>
                        </div>
                    </output>
                </aside>
                <section>
                    <h2>Authentication</h2>
                    <ul>
                        <li>Step 1...</li>
                        <li>Step 2...</li>
                        <li>Step 3...</li>
                    </ul>
                </section>
            </article>
        `;
    }
    async _onWebAuthnLoginEvent(event) {
        const { type } = event;
        let message = event.detail?.message;
        let notificationType = "info";

        switch (type) {
            case "login-started":
                message = "Starting authentication process";
                break;
            case "login-retrieved":
                message = "Validating credentials with server";
                break;
            case "login-finished":
                message = "Authentication completed successfuly";
                notificationType = "success";
                break;
            case "login-error":
                message = message || "Authentication could not be completed successfully";
                notificationType = "error";
                break;
        }

        this._setNotificationMessage(message, notificationType);

        if (type === "login-finished") {
            await hasValidSession();
        }
    }
}

customElements.define("presentation-web-authn-authentication", WebAuthnAuthentication);
