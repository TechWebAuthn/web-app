class Gist extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.gistId = "";
  }

  connectedCallback() {
    this.gistId = this.dataset.gistId;
    this._baseFontSize = Math.floor(this.computedStyleMap().get("font-size").value);
    this._pixelRatio = window.devicePixelRatio;

    this.root.appendChild(this._styles);
    this.root.appendChild(document.createElement("iframe"));
    if (this.gistId) {
      this.render();
    }
  }

  render() {
    const iframe = this.root.querySelector("iframe");
    iframe.id = this.gistId;
    iframe.part = "iframe";
    iframe.title = `Gist ID: ${this.gistId}`;
    iframe.contentDocument.open();
    iframe.contentDocument.writeln(
      `<html style="font-size: ${this._innerFontSize}">
        <body onload="this.frameElement.style.height = 'calc(' +document.body.querySelector('table').scrollHeight + 'px + 4.2rem)'">
          <script type="text/javascript" src="https://gist.github.com/${this.gistId}.js"></script>
        </body>
        <style>
          body { margin: 0; overflow: hidden; }
          .gist .gist-meta {
            position: absolute;
            bottom: calc(1rem + 2px);
            width: calc(100% - 2px);
            box-sizing: border-box;
            font-size: 1.2rem;
            padding: 0.5rem;
          }
          .gist .gist-data {
            height: calc(100% - 1.2rem);
            padding-bottom: 2.5rem;
            box-sizing: border-box;
          }
          .gist .blob-wrapper {
            max-height: 100%;
            overflow: auto;
          }
          .gist .js-line-number,
          .gist .js-file-line {
            font-size: 1.6rem;
            line-height: 1.6;
          }
        </style>
      </html>`
    );
    iframe.contentDocument.close();
  }

  get _styles() {
    const styles = `
      iframe {
        width: 100%;
        border: none;
        max-height: 100%;
      }
    `;
    const styleElement = document.createElement("style");
    styleElement.innerText = styles;
    return styleElement;
  }

  get _innerFontSize() {
    return this._baseFontSize / 2;
  }
}

window.customElements.define("auth-gist", Gist);
