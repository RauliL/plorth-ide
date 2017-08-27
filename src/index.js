import App from "./app";

import { mount } from "redom";

require("./style.sass");

if (window.readyState !== "loading") {
  initialize();
} else {
  window.addEventListener("DOMContentLoaded", initialize);
}

function initialize () {
  mount(document.body, new App());
}
