import {LitElement, html} from 'lit';

class Home extends LitElement {
	render() {
		return html`<h1>Home</h1><ul><li><a href="/login">Login</a></li><li><a href="/stats">Stats</a></li></ul>`;
	}
}

customElements.define('auth-home', Home);
