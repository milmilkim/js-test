import Home from "../pages/Home.js";
import About from "../pages/About.js";

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
];

routes.forEach(({ component }) => {
  if (!customElements.get(component.tagName)) {
    customElements.define(component.tagName, component);
  }
});

const renderPage = () => {
  const path = window.location.pathname;
  const route = routes.find((route) => route.path === path);
  const routerRoot = document.querySelector("router-view");

  if (!routerRoot) return;

  if (route) {
    routerRoot.replaceChildren(document.createElement(route.component.tagName));
  } else {
    routerRoot.innerHTML = `<h1>404 Not Found</h1>`;
  }
};

const navigateTo = (path: string) => {
  window.history.pushState(null, "", path);
  renderPage();
}

export default {
  renderPage,
  navigateTo
};
