import {LitElement, html} from 'lit';

class Login extends LitElement {
	render() {
		return html`<h1>Login</h1><a href="/">Home</a>`;
	}
}

customElements.define('auth-login', Login);
