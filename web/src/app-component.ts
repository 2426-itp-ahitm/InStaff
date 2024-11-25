import { html, render } from "lit-html";
import "./components/home";
import "./components/employee-list";
import "./components/role-list";
import "./components/manager-list";
import "./components/employee-filter-roles";

const routes: Record<string, any> = {
    "": html`<home-component></home-component>`,
    "employee-list": html`<employee-list-component></employee-list-component>`,
    "role-list": html`<role-list-component></role-list-component>`,
    "manager-list": html`<manager-list-component></manager-list-component>`,
    "employee-filter-roles": html`<employee-filter-roles-component></employee-filter-roles-component>`,
};

class AppComponent extends HTMLElement {
    connectedCallback() {
        this.updateView();
        window.addEventListener("hashchange", () => this.updateView());
    }

    updateView() {
        const path = location.hash.replace("#/", "") || "";
        const content = routes[path] || html`<h1>404 - Page Not Found</h1>`;
        render(content, this);
    }
}

customElements.define("app-component", AppComponent);