import {LitElement, html} from 'lit';

class Stats extends LitElement {
	constructor() {
		super();
		this.stats = [];
	}

	static get properties() {
		return {
			stats: Array
		};
	}

	firstUpdated() {
		this.getStats();
	}
	
	render() {
		return html`
			<h1>Stats</h1>
			<a href="/">Home</a>
			<ul>
				${this.stats.map(stat => html`<li>${stat}</li>`)}
			</ul>
		`;
	}

	getStats() {
		const result = new EventSource('/api/users', {withCredentials: true});
		result.onopen = (event) => console.log('Hi', event);
		result.onmessage = (event) => console.log(event);
		result.onclose = (event) => console.info('Bye', event);
		result.onerror = (event) => console.error(event);
	}
}

customElements.define('auth-stats', Stats);
