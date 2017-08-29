import Component from "./component";
import OutputBuffer from "./output-buffer";

import parse from "plorth-parser";
import trim from "lodash/trim";

import { el } from "redom";

export default class ComponentDebugger extends Component {
  constructor () {
    super();

    this.el = el(".component-debugger",
      el("ul.button-list",
        el("li", this.runButton = el("button", "▶ Run")),
        el("li", this.stepButton = el("button", "⏯ Step")),
        el("li", this.stopButton = el("button", "⏹ Stop")),
        el("li", this.clearButton = el("button", "✗ Clear"))
      ),
      this.input = el("textarea"),
      this.output = new OutputBuffer()
    );

    // Destroy cached AST when the source code changes.
    this.input.addEventListener("input", () => {
      const previousSource = this.input.previousSource;
      const currentSource = this.input.value;

      if (previousSource !== currentSource) {
        delete this.context;
        this.input.previousSource = currentSource;
      }
    });

    this.runButton.addEventListener("click", () => this.run());
    this.stepButton.addEventListener("click", () => this.step());
    this.stopButton.addEventListener("click", () => this.stop());
    this.clearButton.addEventListener("click", () => this.clear());
  }

  get name () {
    return "Debugger";
  }

  run () {
    const sourceCode = this.input.value;

    if (!trim(sourceCode).length) {
      return;
    }
    this.dispatchEvent({ type: "execute", sourceCode });
    this.input.focus();
  }

  step () {
    const sourceCode = this.input.value;

    if (!trim(sourceCode).length) {
      return;
    }

    // Continue from previous debugging state if it exists, otherwise create
    // new one.
    if (!this.context) {
      try {
        this.context = {
          values: parse(sourceCode),
          offset: 0,
        };
      } catch (err) {
        this.output.print(`${err}`, "error");
        return;
      }
    }

    if (this.context.offset < this.context.values.length) {
      const value = this.context.values[this.context.offset++];

      this.input.setSelectionRange(value.start, value.end);
      this.dispatchEvent({
        type: "execute",
        sourceCode: sourceCode.substring(value.start, value.end)
      });
    } else {
      this.input.setSelectionRange(0, 0);
      this.context.offset = 0;
    }

    this.input.focus();
  }

  stop () {
    delete this.context;
    this.input.setSelectionRange(0, 0);
    this.input.focus();
  }

  clear () {
    this.dispatchEvent({ type: "execute", sourceCode: "clear" });
  }

  onmount () {
    this.input.focus();
  }
}
