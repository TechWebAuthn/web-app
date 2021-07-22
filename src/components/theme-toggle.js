class ThemeToggle extends HTMLElement {
  constructor() {
    super();
    this._labelMap = {
      dark: "🌘",
      light: "☀️",
    };
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._label = this._labelMap[this._mode];
    this.innerHTML = `<form><button>${this._label}</button></form>`;
    this.querySelector("form").addEventListener("submit", this._update.bind(this));
  }

  get _mode() {
    return document.documentElement.dataset.theme || "light";
  }

  _update(event) {
    event.preventDefault();

    document.documentElement.dataset.theme = this._mode === "light" ? "dark" : "light";
    document.head.querySelector("meta[name=theme-color]").content =
      this._mode === "dark" ? "#000" : "#e9e9e9";
    this.querySelector("button").textContent = this._labelMap[this._mode];
    window.localStorage.setItem("theme", document.documentElement.dataset.theme);
  }
}

customElements.define("theme-toggle", ThemeToggle);
