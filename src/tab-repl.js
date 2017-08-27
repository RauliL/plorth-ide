import EventTarget from "event-target-shim";

import isFunction from "lodash/isFunction";
import trim from "lodash/trim";

import { el, mount } from "redom";

export default class Tab extends EventTarget {
  constructor () {
    super();

    this.lineCounter = 1;

    this.buffer = el(".buffer");
    this.prompt = el("span.prompt", "plorth:1:0>");
    this.input = el("input");
    this.el = el(".tab-repl", this.buffer, el(".input", this.prompt, this.input));

    this.input.addEventListener("keydown", ev => {
      const callback = this[`onKey${ev.key}`];

      if (isFunction(callback)) {
        ev.preventDefault();
        callback.call(this);
      }
    });
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
    mount(this.buffer, container);
  }

  update({ interpreter }) {
    this.prompt.innerText = `plorth:${this.lineCounter}:${interpreter.depth()}>`;
  }

  onmount () {
    this.input.focus();
  }

  onKeyEnter () {
    const text = trim(this.input.value);

    if (text.length > 0) {
      this.print(`${this.prompt.innerText} ${text}`, "user-input");
      this.previous = text;
      ++this.lineCounter;
      this.dispatchEvent({type: "input", text});
    }
    this.input.value = "";
    this.input.focus();
    this.input.scrollIntoView();
  }

  onKeyArrowUp () {
    if (this.previous) {
      const current = trim(this.input.value);

      this.input.value = this.previous;
      this.input.focus();
      this.input.scrollIntoView();
      if (current.length > 0) {
        this.previous = current;
      } else {
        delete this.previous;
      }
    }
  }

  onKeyArrowDown () {
    const current = trim(this.input.value);

    this.input.value = "";
    this.input.focus();
    this.input.scrollIntoView();
    if (current.length > 0) {
      this.previous = current;
    }
  }
}
