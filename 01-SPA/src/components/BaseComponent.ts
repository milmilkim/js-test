abstract class BaseComponent extends HTMLElement {
  protected shadow: ShadowRoot | null = null;
  protected state: Record<string, any> = {};
  protected isShadow = false;

  constructor(options: { isShadow?: boolean } = {}) {
    super();

    if (options.isShadow)  {
      this.shadow = this.attachShadow({ mode: "open" });
    }
  }

  protected abstract get template(): string;
  protected onMounted() {}
  protected onUnmounted() {}

  protected render() {
    const template = document.createElement("template");
    template.innerHTML = this.template;

    if (this.shadow) {
      this.shadow.replaceChildren(template.content.cloneNode(true));
    } else {
      this.replaceChildren(template.content.cloneNode(true)); 
    }
  }

  protected updateComponent() {}

  connectedCallback() {
    this.render();
    this.onMounted();
  }

  disconnectedCallback() {
    this.onUnmounted();
  }

  attributeChangedCallback(attrName: string, _oldVal: string, newVal: string) {
    this.state[attrName] = newVal;
    this.updateComponent();
  }
}

export default BaseComponent;
