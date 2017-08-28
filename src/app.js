import ComponentREPL from "./component-repl";
import Plorth from "plorth";
import StackPanel from "./stack-panel";

import { el, mount } from "redom";

export default class App {
  constructor () {
    this.interpreter = new Plorth();
    this.repl = new ComponentREPL();
    this.currentComponent = this.repl;

    this.components = [this.repl];

    this.el = el(".container",
      el(".component-container",
        el("ul.button-list",
           this.components.map(component => {
             const button = el("button", component.name);

             if (this.currentComponent === component) {
               button.className = "active";
             }
             button.addEventListener("click", () => {
               if (this.currentComponent === component) {
                 return;
               }
               unmount(this.componentPlaceholder, this.currentComponent);
               mount(this.componentPlaceholder, component);
               this.currentComponent = component;
               // TODO: Remove ".active" from other buttons.
               button.className = "active";
             });

             return el("li", button);
           })
        ),
        this.componentPlaceholder = el(".component-placeholder", this.repl)
      ),
      this.stack = new StackPanel()
    );

    this.interpreter.print = text => this.currentComponent.output.print(text);
    this.interpreter.printErr = text => this.currentComponent.output.print(text, "error");

    this.repl.addEventListener("input", ev => {
      const { text } = ev;

      try {
        this.interpreter.execute(text);
      } catch (err) {
        this.repl.print(`${err}`, "error");
      }
      this.stack.update(this.interpreter);
      this.repl.update(this.interpreter);
    });
  }
}
