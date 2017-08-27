import { el, mount } from "redom";

export default class Buffer {
  constructor () {
    this.el = el("ul.buffer");
  }

  add (text, className) {
    const container = el("li", `${text}`);

    if (className) {
      container.className = className;
    }
    mount(this.el, container);
  }
}
