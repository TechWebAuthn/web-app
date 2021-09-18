import { LitElement, html, unsafeCSS, css } from "lit";
import resets from "../styles/resets.css?inline";
import loaders from "../styles/loaders.css?inline";

let am4core;
let am4plugins_wordCloud;
let am4themes_animated;

class WordCloudUsers extends LitElement {
  constructor() {
    super();
    this._chartsLoaded = false;
    this._firstUserLoaded = false;
  }

  static get properties() {
    return {
      _firstUserLoaded: Boolean,
    };
  }

  static get styles() {
    return [
      unsafeCSS(resets),
      unsafeCSS(loaders),
      css`
        :host {
          align-items: center;
          width: 100%;
          max-height: 100%;
          height: inherit;
          display: grid;
          justify-content: center;
          grid-template-rows: 1fr;
          grid-template-columns: 1fr;
          grid-template-areas: none;
          position: relative;
        }

        #users {
          width: 100%;
          height: 100%;
        }

        .loader {
          margin: auto;
        }
      `,
    ];
  }

  firstUpdated() {
    this._getFeedback();
  }

  disconnectedCallback() {
    this._userSSEConnection?.close();
  }

  render() {
    return html`
      <div ?hidden=${!this._firstUserLoaded} id="users"></div>
      <progress ?hidden="${this._firstUserLoaded}" class="loader" indeterminate></progress>
    `;
  }

  async _getFeedback() {
    const series = await this._drawWordCloud();
    this._userSSEConnection = new EventSource("/api/users", {
      withCredentials: true,
    });
    this._userSSEConnection.addEventListener("welcome", () => {
      this.shadowRoot.querySelector("p")?.remove();
    });
    this._userSSEConnection.addEventListener("register", (event) => {
      this.shadowRoot.querySelector("p")?.remove();
      if (!this._firstUserLoaded) {
        this._firstUserLoaded = true;
      }
      this._updateWordCloud(event, series);
    });
    this._userSSEConnection.onerror = () => {
      if (!this.shadowRoot.querySelector("p")) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Could not load registered users";
        this.shadowRoot.appendChild(errorMessage);
      }
    };
  }

  async _drawWordCloud() {
    if (!this._chartsLoaded) {
      const { useTheme, create, percent, ColorSet } = await import("@amcharts/amcharts4/core");
      am4core = { useTheme, create, percent, ColorSet };
      const { WordCloud, WordCloudSeries } = await import("@amcharts/amcharts4/plugins/wordCloud");
      am4plugins_wordCloud = { WordCloud, WordCloudSeries };
      am4themes_animated = (await import("@amcharts/amcharts4/themes/animated")).default;
      this._chartsLoaded = true;
    }

    am4core.useTheme(am4themes_animated);

    const chart = am4core.create(this.shadowRoot.querySelector("#users"), am4plugins_wordCloud.WordCloud);
    const series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());

    chart.responsive.enabled = true;
    series.data = [];
    series.accuracy = 4;
    series.step = 15;
    series.rotationThreshold = 0.7;
    series.maxCount = 200;
    series.minWordLength = 2;
    series.labels.template.margin(8, 8, 8, 8);
    series.maxFontSize = am4core.percent(30);
    series.dataFields.word = "word";
    series.dataFields.value = "count";
    series.colors = new am4core.ColorSet();
    series.colors.passOptions = {}; // makes it loop
    series.angles = [0, -90];
    series.fontWeight = "700";

    return series;
  }

  _updateWordCloud(event, series) {
    const { lastEventId } = event;
    series.data = [...series.data, { word: lastEventId, count: 1 }];
  }
}

customElements.define("word-cloud-users", WordCloudUsers);
