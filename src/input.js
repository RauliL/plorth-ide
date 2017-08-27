import EventTarget from "event-target-shim";

import isFunction from "lodash/isFunction";
import trim from "lodash/trim";

import { el } from "redom";

export default class Input extends EventTarget {
  constructor () {
    super();

    this.prompt = el(".prompt", "plorth:1:0>");
    this.input = el("input");

    this.el = el(".input", this.prompt, this.input);

    this.input.addEventListener("keydown", ev => {
      const callback = this[`onKey${ev.key}`];

      if (isFunction(callback)) {
        ev.preventDefault();
        callback.call(this);
      }
    });
  }

  onmount () {
    this.input.focus();
  }

  onKeyEnter () {
    const text = trim(this.input.value);

    if (text.length > 0) {
      this.previous = text;
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
