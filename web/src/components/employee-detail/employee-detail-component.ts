import { html, render } from "lit-html";
import { Employee } from "../../models/employee";
import { loadEmployeeDetails } from "./employee-detail-service";
import { loadAllRoles } from "../role-list/role-list-service"; // Importiere die Funktion zum Laden der Rollen

class EmployeeDetailComponent extends HTMLElement {
    private _employeeId: number | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this._employeeId = Number(this.getAttribute("employee-id"));
        await this.renderEmployeeDetails();
    }

    async loadRoles() {
        const roles = await loadAllRoles();
        return roles.reduce((acc, role) => {
            acc[role.id] = role.roleName; // Mappe role_id zu roleName
            return acc;
        }, {} as Record<number, string>);
    }

    async renderEmployeeDetails() {
        if (!this._employeeId) return;

        const cssResponse = await fetch("../../../style.css");
        const css = await cssResponse.text();

        const styleElement = document.createElement("style");
        styleElement.textContent = css;
        this.shadowRoot.appendChild(styleElement);

        const employee = await loadEmployeeDetails(this._employeeId);
        const rolesMap = await this.loadRoles(); // Lade die Rollen

        // Mappe die role_ids zu roleNames
        const roleNames = employee.roles.map(roleId => rolesMap[roleId]).join(', ');

        render(this.detailTemplate(employee, roleNames), this.shadowRoot);
    }

    detailTemplate(employee: Employee, roleNames: string) {
        return html`
            <h2>${employee.firstname} ${employee.lastname}</h2> 
            <h3><i>${employee.company_name}</i></h3>
            <p><b>Birthdate:</b> ${employee.birthdate}</p>
            <p><b>Email:</b> ${employee.email}</p>
            <p><b>Telephone:</b> ${employee.telephone}</p>
            <p><b>Roles:</b> ${roleNames}</p> <!-- Zeige die roleNames an -->
        `;
    }
}

customElements.define("employee-detail-component", EmployeeDetailComponent);