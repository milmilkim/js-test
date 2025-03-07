import BaseComponent from "../components/BaseComponent";

export default class AboutPage extends BaseComponent {
  static tagName = "about-page";
  get template() {
    return /* HTML */ ` <h1>About</h1> `;
  }
}
