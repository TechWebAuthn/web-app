class Gist extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
    this.gistId = "";
  }

  connectedCallback() {
    this.gistId = this.dataset.gistId;

    this.root.appendChild(this._styles);
    this.root.appendChild(document.createElement("iframe"));
    if (this.gistId) {
      this.render();
    }

    this.onresize = console.log;
  }

  render() {
    const iframe = this.root.querySelector("iframe");
    iframe.id = this.gistId;
    iframe.part = "iframe";
    iframe.title = `Gist ID: ${this.gistId}`;
    iframe.contentDocument.open();
    iframe.contentDocument.writeln(
      `<html>
        <body onload="this.frameElement.style.height = document.body.querySelector('table').scrollHeight + 40 + 'px'">
          <script type="text/javascript" src="https://gist.github.com/${this.gistId}.js"></script>
        </body>
        <style>
          body { margin: 0; overflow: hidden; }
          .gist-meta {
            position: absolute;
            bottom: 0;
            width: 100%;
            box-sizing: border-box;
          }
          .gist-data {
            height: calc(100% - 40px);
          }
          .gist .blob-wrapper {
            max-height: 100%;
            overflow: auto;
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
}

window.customElements.define("auth-gist", Gist);
