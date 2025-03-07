import BaseComponent from "../components/BaseComponent";
import router from './index'

export default class RouterLink extends BaseComponent {
  constructor() {
    super();
  }

  static tagName = "router-link";


  state = {
    to: "/",
  }

  protected get template() {
    return /* HTML */ `<a href=${this.state.to}>${this.innerHTML}</a>`;
  }

  static get observedAttributes() {
    return ["to"];
  }



  handleClick = (e: Event) => {
    e.preventDefault();
    router.navigateTo(this.state.to);
  };

  onMounted() {
   this.addEventListener("click", this.handleClick);
  }

  onUnmounted() {
   this.removeEventListener("click", this.handleClick);
  }
}

