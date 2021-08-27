import { LitElement, html, unsafeCSS, css } from "lit";
import { setNotificationMessage } from "./utils/notification";

import resets from "./styles/resets.css?inline";
import cards from "./styles/cards.css?inline";
import headings from "./styles/headings.css?inline";
import stats from "./styles/stats.css?inline";
import notifications from "./styles/notifications.css?inline";
import layouts from "./styles/layouts.css?inline";
import loaders from "./styles/loaders.css?inline";

const statsMap = {
  login: "Logged in",
  register: "Registered",
};

let am4core;
let am4plugins_wordCloud;
let am4themes_animated;

class Stats extends LitElement {
  constructor() {
    super();
    this.stats = { login: 0, register: 0 };
    this._statsDirection = { login: "⏳", register: "⏳" };
    this._setNotificationMessage = setNotificationMessage.bind(this);
    this._chartsLoaded = false;
    this._feedbackLoaded = false;
  }

  static get properties() {
    return {
      stats: Object,
      _feedbackLoaded: Boolean,
    };
  }

  static get styles() {
    return [
      unsafeCSS(resets),
      unsafeCSS(cards),
      unsafeCSS(headings),
      unsafeCSS(stats),
      unsafeCSS(notifications),
      unsafeCSS(layouts),
      unsafeCSS(loaders),
      css`
        #feedback {
          width: 100%;
          height: 100%;
        }

        [role="region"] + g {
          display: none;
        }
      `,
    ];
  }

  firstUpdated() {
    this._getStats();
    this._getFeedback();
  }

  disconnectedCallback() {
    this._statsSSEConnection.close();
    this._feedbackSSEConnection.close();
  }

  render() {
    return html`
      <h2 class="page-subtitle">Stats</h2>
      <p id="notification" class="notification"></p>
      <div class="card">
        <dl class="stats">
          ${Object.keys(this.stats).map(
            (key) => html`
              <dt>${statsMap[key]}</dt>
              <dd>${this.stats[key]} <span>${this._statsDirection[key]}</span></dd>
            `
          )}
        </dl>
      </div>
      <div class="expandable card center column">
        <button @click="${this._toggleFullscreen}" class="expand">&#x26F6;</button>
        <h3>Feedback</h3>
        <div id="feedback"></div>
        <progress ?hidden="${this._feedbackLoaded}" class="loader" indeterminate></progress>
      </div>
    `;
  }

  _getStats() {
    this._statsSSEConnection = new EventSource("/api/users", {
      withCredentials: true,
    });
    this._statsSSEConnection.addEventListener("welcome", this._updateStats.bind(this));
    this._statsSSEConnection.addEventListener("login", this._updateStats.bind(this));
    this._statsSSEConnection.addEventListener("logout", this._updateStats.bind(this));
    this._statsSSEConnection.addEventListener("register", this._updateStats.bind(this));
    this._statsSSEConnection.onopen = () => this._setNotificationMessage("Connection established", "success", false);
    this._statsSSEConnection.onclose = () => this._setNotificationMessage("Connection closed", "info", false);
    this._statsSSEConnection.onerror = () =>
      this._setNotificationMessage("Connection could not be established", "error", false);
  }

  _updateStats(event) {
    try {
      const newData = JSON.parse(event.data);
      this._updateStatsDirection({ ...this.stats }, newData, event.type);
      this.stats = { ...this.stats, ...newData };
    } catch (e) {
      this._setNotificationMessage("Something went wrong", "error");
    }
  }

  _updateStatsDirection(oldData, newData, eventType) {
    if (eventType === "welcome") return;

    for (const stat in oldData) {
      this._statsDirection[stat] = newData[stat] > oldData[stat] ? "⬆️" : newData[stat] < oldData[stat] ? "⬇️" : "⏳";
    }
  }

  async _getFeedback() {
    const series = await this._drawWordCloud();
    this._feedbackSSEConnection = new EventSource("/api/feedback", {
      withCredentials: true,
    });
    this._feedbackSSEConnection.addEventListener("feedback", (event) => this._updateWordCloud(event, series));
    this._feedbackSSEConnection.onerror = () =>
      this._setNotificationMessage("Could not retrieve feedback", "error", false);
    this._feedbackLoaded = true;
  }

  async _drawWordCloud() {
    if (!this._chartsLoaded) {
      am4core = await import("@amcharts/amcharts4/core");
      am4plugins_wordCloud = await import("@amcharts/amcharts4/plugins/wordCloud");
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

  _toggleFullscreen(event) {
    const parent = event.target.parentElement;
    parent.classList.toggle("fullscreen");
  }
}

customElements.define("auth-stats", Stats);
