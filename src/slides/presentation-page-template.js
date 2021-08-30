import { LitElement } from "lit";
import { connectToBroadcastChannel } from "../utils/network";

export default class PresentationPageTemplate extends LitElement {
  constructor() {
    super();
    this._broadcastChannel = connectToBroadcastChannel("presentation");
    this._broadcastChannel?.postMessage(this._prompterMessage);
  }

  get _prompterMessage() {
    return `
      Prompter Title

      Prompter help text line 1
      Prompter help text line 2
    `;
  }
}
