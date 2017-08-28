import Component from "./component";
import OutputBuffer from "./output-buffer";

import isFunction from "lodash/isFunction";
import trim from "lodash/trim";

import { el } from "redom";

export default class ComponentREPL extends Component {
  constructor () {
    super();

    this.lineCounter = 1;

    this.el = el(".component-repl",
      this.output = new OutputBuffer(),
      el(".input",
        this.prompt = el("span.prompt", "plorth:1:0>"),
        this.input = el("input")
      )
    );

    this.input.addEventListener("keydown", ev => {
      const callback = this[`onKey${ev.key}`];

      if (isFunction(callback)) {
        ev.preventDefault();
        callback.call(this);
      }
    });
  }

  get name () {
    return "REPL";
  }

  update(interpreter) {
    this.prompt.innerText = `plorth:${this.lineCounter}:${interpreter.depth()}>`;
  }

  onmount () {
    this.input.focus();
  }

  onKeyEnter () {
    const text = trim(this.input.value);

    if (text.length > 0) {
      this.output.print(`${this.prompt.innerText} ${text}`, "user-input");
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
