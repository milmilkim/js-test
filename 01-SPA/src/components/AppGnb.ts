import BaseComponent from "./BaseComponent";

export default class AppGnb extends BaseComponent {
  constructor() {
    super();
  }

  static tagName = "app-gnb";


  protected get template() {
    return /* HTML */ `
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    `;
  }
}

