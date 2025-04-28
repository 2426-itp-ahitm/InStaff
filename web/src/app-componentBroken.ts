import { html, render } from "lit-html";
import "./components/landing-page";
import "./components/home";
import "./components/employee-list";
import "./components/employee-filter-roles";
import "./components/employee-detail";
import "./components/role-list";
import "./components/add-role";
import "./components/manager-list";
import "./components/shift-list";
import "./components/shift-detail";
import "./components/employee-detail";
import "./components/add-employee";
import "./components/add-shift";
import "./components/edit-shift";
import "./components/nav-bar";
import "./components/calendar";
import "./components/shift-confirmation";


const routes: Record<string, any> = {
    "": html`<landing-page-component></landing-page-component>`,
    "instaff": html`<home-component></home-component>`,
    "employee-list": html`<employee-list-component></employee-list-component>`,
    "employee-filter-roles": html`<employee-filter-roles-component></employee-filter-roles-component>`,
    "employee-detail": html`<employee-detail-component employee-id="1"></employee-detail-component>`,
    "employee-edit": html`<employee-edit-component employee-id="1"></employee-edit-component>`,
    "role-list": html`<role-list-component></role-list-component>`,
    "add-role": html`<add-role-component></add-role-component>`,
    "manager-list": html`<manager-list-component></manager-list-component>`,
    "shift-list": html`<shift-list-component></shift-list-component>`,
    "shift-detail": html`<shift-detail-component shift-id="3"></shift-detail-component>`,
    "add-employee": html`<add-employee-component></add-employee-component>`,
    "add-shift": html`<add-shift-component shift-start-time="2025-04-10T09:00" shift-end-time="2025-04-10T17:00"></add-shift-component>`,
    "edit-shift": html`<edit-shift-component></edit-shift-component>`,
    "calendar": html`<calendar-component></calendar-component>`,
    "shift-confirmation": (params) => html`<shift-confirmation-component assignment-id="${params.get("assignmentId") || ""}"></shift-confirmation-component>`,
};

class AppComponent extends HTMLElement {
    connectedCallback() {
        this.updateView();
        window.addEventListener("hashchange", () => this.updateView());
    }

    updateView() {
        const [path, queryString] = location.hash.replace("#/", "").split("?")
        const params = new URLSearchParams(queryString || "")
     
        const showNav = path != ""
     
        const content = html`
           ${showNav ? html`<nav-bar-component></nav-bar-component>` : ""}
           ${routes[path] ? routes[path](params) : html`
              <h1 style="font-size: 3em; margin-top: 35vh; text-align: center">404 - Page Not Found</h1>
           `}
        `
     
        render(content, this)
     }
}

customElements.define("app-component", AppComponent);