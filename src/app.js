import ComponentDebugger from "./component-debugger";
import ComponentREPL from "./component-repl";
import Plorth from "plorth";
import StackPanel from "./stack-panel";

import { el, mount, unmount } from "redom";

export default class App {
  constructor () {
    this.interpreter = new Plorth();
    this.repl = new ComponentREPL();
    this.debugger = new ComponentDebugger();
    this.currentComponent = this.repl;

    this.components = [this.repl, this.debugger];

    this.el = el(".container",
      el(".component-container",
        this.buttonList = el("ul.button-list",
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
               this.buttonList.querySelectorAll("button").forEach(otherButton => {
                 otherButton.className = "";
               });
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

    this.repl.addEventListener("input", ev => this.execute(ev.text));
    this.debugger.addEventListener("execute", ev => this.execute(ev.sourceCode));
  }

  execute (source) {
    try {
      this.interpreter.execute(source);
    } catch (err) {
      this.currentComponent.output.print(`${err}`, "error");
    }
    this.stack.update(this.interpreter);
    this.repl.update(this.interpreter);
  }
}
