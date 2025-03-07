import BaseComponent from "./BaseComponent";

export default class AppFooter extends BaseComponent {
  constructor() {
    super({isShadow: true});
  }

  static tagName = "app-footer";

  protected state = {
    color: "blue",
  };

  protected get template() {
    return /* HTML */ `
      <style>
        h1 {
          font-size: 12px;
          color: var(--title-color, ${this.state.color});
        }
      </style>
      <h1><slot name="content">DEFAULT TEXT</slot></h1>
    `;
  }

  static get observedAttributes() {
    return ["color"];
  }

  updateComponent(): void {
    const h1 = this.shadowRoot?.querySelector("h1");
    const host: HTMLElement | null = this.shadowRoot
      ?.host as HTMLElement | null;

    if (h1 && host) {
      host.style.setProperty("--title-color", this.state.color);
    }
  }
}