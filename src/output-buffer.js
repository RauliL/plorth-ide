import isFunction from "lodash/isFunction";

import { el, mount } from "redom";

export default class OutputBuffer {
  constructor () {
    this.el = el("ul.output");
  }

  print (text, className) {
    const container = el("li", `${text}`);

    if (className) {
      container.className = className;
    }
    if (isFunction(window.getSelection)) {
      container.addEventListener("click", () => {
        const selection = window.getSelection();
        const range = document.createRange();

        range.selectNodeContents(container);
        selection.removeAllRanges();
        selection.addRange(range);
      });
    }
    mount(this.el, container);
  }
}
