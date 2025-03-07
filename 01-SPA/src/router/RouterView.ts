import BaseComponent from "../components/BaseComponent";

import router from "./index";

export default class RouterView extends BaseComponent {
  static tagName = "router-view";
  get template() {
    return /* HTML */ ` <div id="router-root"></div> `;
  }

  protected onMounted(): void {
    router.renderPage();
    window.addEventListener("popstate", () => {
      router.renderPage();
    });
  }

  protected onUnmounted(): void {
    window.removeEventListener("popstate", () => router.renderPage());
  }
}
