import { LitElement, html, unsafeCSS, css } from "lit";
import resets from "../styles/resets.css?inline";
import loaders from "../styles/loaders.css?inline";

let am4core;
let am4plugins_wordCloud;
let am4themes_animated;

class WordCloudFeedback extends LitElement {
  constructor() {
    super();
    this._chartsLoaded = false;
    this._feedbackLoaded = false;
  }

  static get properties() {
    return {
      _feedbackLoaded: Boolean,
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

        #feedback {
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
    this._feedbackSSEConnection.close();
  }

  render() {
    return html`
      <div ?hidden=${!this._feedbackLoaded} id="feedback"></div>
      <progress ?hidden="${this._feedbackLoaded}" class="loader" indeterminate></progress>
    `;
  }

  async _getFeedback() {
    const series = await this._drawWordCloud();
    this._feedbackSSEConnection = new EventSource("/api/feedback", {
      withCredentials: true,
    });
    this._feedbackSSEConnection.addEventListener("feedback", (event) => {
      this.shadowRoot.querySelector("p")?.remove();
      this._updateWordCloud(event, series);
    });
    this._feedbackSSEConnection.onerror = () => {
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "Could not load feedback";
      this.shadowRoot.appendChild(errorMessage);
    };
    this._feedbackLoaded = true;
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

    const chart = am4core.create(this.shadowRoot.querySelector("#feedback"), am4plugins_wordCloud.WordCloud);
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
    const { data } = event;
    const parsedData = JSON.parse(data);
    const newData = [...series.data];
    Object.entries(parsedData).forEach(([key, value]) => {
      const index = newData.findIndex((feedback) => feedback.word === key);

      if (index >= 0) {
        newData[index].count = value;
      } else {
        newData.push({ word: key, count: value });
      }
    });
    series.data = [...newData];
  }
}

customElements.define("word-cloud-feedback", WordCloudFeedback);
