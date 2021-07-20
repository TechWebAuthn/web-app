import { LitElement, html } from "lit";

class Stats extends LitElement {
  constructor() {
    super();
    this.stats = [];
  }

  static get properties() {
    return {
      stats: Object,
    };
  }

  firstUpdated() {
    this.getStats();
  }

  render() {
    return html` <h1>Stats</h1> `;
  }

  getStats() {
    const sse = new EventSource("/api/users", { withCredentials: true });
    sse.addEventListener("welcome", console.log);
    sse.addEventListener("login", console.log);
    sse.addEventListener("register", console.log);
    sse.onopen = (event) => console.log("Hi", event);
    sse.onclose = (event) => console.info("Bye", event);
    sse.onerror = (event) => console.error(event);
  }
}

customElements.define("auth-stats", Stats);
