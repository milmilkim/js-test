import BaseComponent from "./components/BaseComponent";
import AppHeader from "./components/AppHeader";
import AppGnb from './components/AppGnb';
import AppFooter from "./components/AppFooter";
import RouterView from "./router/RouterView";
import RouterLink from "./router/RouterLink";


const components = [AppHeader, AppGnb,RouterView, AppFooter, RouterLink];

components.forEach((component) => {
  customElements.define(component.tagName, component);
});


export default class App extends BaseComponent {
  static tagName = "app-root";
  get template() {
    return /* HTML */ `
      <app-header>
        <h1 slot="content">헤더입니다</h1>
      </app-header>

      <app-gnb></app-gnb>
      
      <router-view></router-view>
      
      <app-footer>
        <h1 slot="content">푸터입니다</h1>
      </app-footer>
    `;
  }
}
