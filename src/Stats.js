import { LitElement, html, unsafeCSS, css } from "lit";
import { setNotificationMessage } from "./utils/notification";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4plugins_wordCloud from "@amcharts/amcharts4/plugins/wordCloud";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import resets from "./styles/resets.css?inline";
import cards from "./styles/cards.css?inline";
import headings from "./styles/headings.css?inline";
import stats from "./styles/stats.css?inline";
import notifications from "./styles/notifications.css?inline";
import layouts from "./styles/layouts.css?inline";

const statsMap = {
  login: "Logged in",
  register: "Registered",
};

class Stats extends LitElement {
  constructor() {
    super();
    this.stats = { login: 0, register: 0 };
    this._statsDirection = { login: "⏳", register: "⏳" };
    this._setNotificationMessage = setNotificationMessage.bind(this);
  }

  static get properties() {
    return {
      stats: Object,
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
      </div>
    `;
  }

  _getStats() {
    this._statsSSEConnection = new EventSource("/api/users", {
      withCredentials: true,
    });
    this._statsSSEConnection.addEventListener("welcome", this._updateStats.bind(this));
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

  _getFeedback() {
    this._drawWordCloud();
    this._feedbackSSEConnection = new EventSource("/api/feedback", {
      withCredentials: true,
    });
    this._feedbackSSEConnection.addEventListener("message", (event) => console.log(event));
    this._feedbackSSEConnection.onerror = () =>
      this._setNotificationMessage("Could not retrieve feedback", "error", false);
  }

  _drawWordCloud() {
    am4core.useTheme(am4themes_animated);

    const chart = am4core.create(this.shadowRoot.querySelector("#feedback"), am4plugins_wordCloud.WordCloud);
    window.chart = chart;
    const series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());

    chart.responsive.enabled = true;
    series.accuracy = 4;
    series.step = 15;
    series.rotationThreshold = 0.7;
    series.maxCount = 200;
    series.minWordLength = 2;
    series.labels.template.margin(8, 8, 8, 8);
    series.maxFontSize = am4core.percent(30);
    series.dataFields.word = "tag";
    series.dataFields.value = "weight";

    series.data = [
      {
        tag: "cool",
        weight: 60,
      },
      {
        tag: "awesome",
        weight: 80,
      },
      {
        tag: "loved it",
        weight: 90,
      },
      {
        tag: "good job",
        weight: 25,
      },
      {
        tag: "nice",
        weight: 30,
      },
      {
        tag: "great",
        weight: 45,
      },
      {
        tag: "liked it",
        weight: 160,
      },
      {
        tag: "so and so",
        weight: 20,
      },
      {
        tag: "new stuff",
        weight: 78,
      },
    ];

    series.colors = new am4core.ColorSet();
    series.colors.passOptions = {}; // makes it loop
    series.angles = [0, -90];
    series.fontWeight = "700";
  }

  _toggleFullscreen(event) {
    const parent = event.target.parentElement;
    parent.classList.toggle("fullscreen");
  }
}

customElements.define("auth-stats", Stats);
