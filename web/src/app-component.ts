import { html, render } from "lit-html";
import "./components/home";
import "./components/employee-list";
import "./components/employee-filter-roles";
import "./components/employee-detail";
import "./components/role-list";
import "./components/manager-list";
import "./components/shift-list";
import "./components/shift-detail";
import "./components/employee-detail";
import "./components/add-employee";
import "./components/add-shift";
import "./components/edit-shift";

const routes: Record<string, any> = {
    "": html`<home-component></home-component>`,
    "employee-list": html`<employee-list-component></employee-list-component>`,
    "employee-filter-roles": html`<employee-filter-roles-component></employee-filter-roles-component>`,
    "employee-detail": html`<employee-detail-component employee-id="1"></employee-detail-component>`,
    "employee-edit": html`<employee-edit-component employee-id="1"></employee-edit-component>`,
    "role-list": html`<role-list-component></role-list-component>`,
    "manager-list": html`<manager-list-component></manager-list-component>`,
    "shift-list": html`<shift-list-component></shift-list-component>`,
    "shift-detail": html`<shift-detail-component shift-id="3"></shift-detail-component>`,
    "add-employee": html`<add-employee-component></add-employee-component>`,
    "add-shift": html`<add-shift-component></add-shift-component>`,
    "edit-shift": html`<edit-shift-component></edit-shift-component>`,
};

class AppComponent extends HTMLElement {
    connectedCallback() {
        this.updateView();
        window.addEventListener("hashchange", () => this.updateView());
    }

    updateView() {
        const path = location.hash.replace("#/", "") || "";
        const content = routes[path] || html`<div style="text-align: center;"><h1 style="font-size: 3em; margin-top: 35vh">404 - Page Not Found</h1><button onclick="window.history.back()" id="backButton">Go Back</button></div>`;
        render(content, this);
    }
}

customElements.define("app-component", AppComponent);