class Gist extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.gistId = "";
    this.multiFile = false;
  }

  connectedCallback() {
    this.gistId = this.dataset.gistId;
    this.multiFile = this.dataset.multiFile !== undefined;
    this._baseFontSize = Math.floor(this.computedStyleMap().get("font-size").value);
    this._pixelRatio = window.devicePixelRatio;

    this.root.appendChild(this._styles);
    this.root.appendChild(document.createElement("iframe"));
    this.root.appendChild(document.createElement("button"));
    if (this.gistId) {
      this.render();
    }
  }

  render() {
    const iframe = this.root.querySelector("iframe");
    const fullscreenToggle = this.root.querySelector("button");
    fullscreenToggle.textContent = "⛶";
    fullscreenToggle.part = "fullscreen-toggle";
    fullscreenToggle.onclick = () => {
      this.classList.toggle("fullscreen");
      iframe.contentDocument.querySelector("body").classList.toggle("fullscreen");
    };
    const iframeHeight = this.multiFile
      ? "document.body.scrollHeight"
      : "document.querySelector('table').scrollHeight + document.querySelector('.gist-meta').scrollHeight + 18";
    iframe.id = this.gistId;
    iframe.part = "iframe";
    iframe.title = `Gist ID: ${this.gistId}`;
    iframe.contentDocument.open();
    iframe.contentDocument.writeln(
      `<html style="font-size: ${this._innerFontSize}">
        <body part="body" onload="this.frameElement.height = ${iframeHeight}">
          <script type="text/javascript" src="https://gist.github.com/${this.gistId}.js"></script>
        </body>
        <style>
          body { margin: 0; overflow: ${this.multiFile ? "auto" : "hidden"}; }
          body.fullscreen { height: 100%; box-sizing: border-box; padding: 2rem; }
          .gist .gist-meta {
            font-size: 1rem;
            padding: 0.5rem;
          }
          .gist .gist-file {
            display: flex;
            height: ${this.multiFile ? "auto" : "100%"};
            flex-direction: column;
            box-sizing: border-box;
          }
          .gist .gist-file:last-of-type {
            margin: 0;
          }
          .gist .gist-data {
            height: 100%;
          }
          .gist .blob-wrapper {
            max-height: 100%;
            overflow: auto;
          }
          .gist .js-line-number,
          .gist .js-file-line {
            font-size: 1.6rem;
            line-height: 1.5;
          }
        </style>
      </html>`
    );
    iframe.contentDocument.close();
  }

  get _styles() {
    const styles = `
      :host {
        position: relative;
      }
      iframe {
        width: 100%;
        border: none;
        max-height: 100%;
      }
      button {
        padding: 0.5rem;
        position: absolute;
        top: 0;
        right: 0;
        font-size: 1.4rem;
        line-height: 1;
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
