import { el, mount } from "redom";

export default class StackPanel {
  constructor () {
    this.el = el("ul.stack-panel");
  }

  update (interpreter) {
    const depth = interpreter.depth();

    this.el.innerHTML = "";
    for (let i = 0; i < depth; ++i) {
      mount(this.el, el("li", `${depth - i}: ${interpreter.stack(i)}`));
    }
  }
}
