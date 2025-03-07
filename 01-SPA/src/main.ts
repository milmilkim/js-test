import App from "./App.js";

customElements.define(App.tagName, App);
const app = document.createElement(App.tagName);
document.getElementById("app")?.appendChild(app);