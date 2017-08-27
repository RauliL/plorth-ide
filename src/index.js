import Buffer from "./buffer";
import Input from "./input";
import Plorth from "plorth";
import StackPanel from "./stack-panel";

import { el, mount } from "redom";

require("./style.sass");

if (window.readyState !== "loading") {
  initialize();
} else {
  window.addEventListener("DOMContentLoaded", initialize);
}

function initialize () {
  const interpreter = new Plorth();
  const stackPanel = new StackPanel();
  const buffer = new Buffer();
  const input = new Input();
  let lineCounter = 1;

  mount(document.body, el(".editor-panel", buffer, input));
  mount(document.body, stackPanel);

  interpreter.print = (text, className) => buffer.add(text, className);
  interpreter.printErr = text => buffer.add(text, "error");

  input.addEventListener("input", ev => {
    const { text } = ev;

    buffer.add(`${input.prompt.innerText} ${text}`, "user-input");
    try {
      interpreter.execute(text);
    } catch (err) {
      interpreter.printErr(`${err}`);
    }
    input.prompt.innerText = `plorth:${++lineCounter}:${interpreter.depth()}>`;
    stackPanel.update(interpreter);
  });
}
