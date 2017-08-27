import Plorth from "plorth";
import StackPanel from "./stack-panel";
import TabREPL from "./tab-repl";

import { el, mount } from "redom";

export default class App {
  constructor () {
    this.interpreter = new Plorth();
    this.interpreter.print = text => this.repl.print(text);
    this.interpreter.printErr = text => this.repl.print(text, "error");

    this.repl = new TabREPL();
    this.stack = new StackPanel();

    this.el = el(".container", el(".tab-container", this.repl), this.stack);

    this.repl.addEventListener("input", ev => {
      const { text } = ev;

      try {
        this.interpreter.execute(text);
      } catch (err) {
        this.repl.print(`${err}`, "error");
      }
      this.stack.update(this.interpreter);
      this.repl.update({ interpreter: this.interpreter });
    });
  }
}
