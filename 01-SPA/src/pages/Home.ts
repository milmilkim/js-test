import BaseComponent from "../components/BaseComponent";

export default class HomePage extends BaseComponent {
  static tagName = "home-page";
  get template() {
    return /* HTML */ ` <h1>Home</h1> `;
  }
}
