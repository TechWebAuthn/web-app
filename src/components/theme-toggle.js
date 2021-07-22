class ThemeToggle extends HTMLElement {
  constructor() {
    super();
    this._id = Date.now().toString(32);
    this._labelMap = {
      dark: "🌘",
      light: "☀️",
    };
    this.setAttribute("role", "button");
    this.setAttribute("tabindex", "0");
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._label = this._labelMap[this._mode];
    this.innerHTML = `<label for="${this._id}"><span>${this._label}</span><input id="${this._id}" type="checkbox"></label>`;
    const input = this.querySelector("input");
    input.addEventListener("change", this._update.bind(this));
    this.addEventListener("keydown", (event) => {
      if (["Enter", "Space"].includes(event.code)) input.click();
    });
  }

  get _mode() {
    return document.documentElement.dataset.theme || "light";
  }

  _update() {
    document.documentElement.dataset.theme = this._mode === "light" ? "dark" : "light";
    this.querySelector("span").textContent = this._labelMap[this._mode];
  }
}

customElements.define("theme-toggle", ThemeToggle);
