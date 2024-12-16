import { html, render } from "lit-html";
import { Employee } from "../../models/employee";
import { loadEmployeeDetails } from "./employee-detail-service";
import { loadAllRoles } from "../role-list/role-list-service";

class EmployeeDetailComponent extends HTMLElement {
   private _employeeId: string = "";

   constructor() {
      super();
      this.attachShadow({ mode: "open" });
   }

   static get observedAttributes() {
      return ['employee-id'];
   }

   get employeeId() {
      return this._employeeId;
   }

   set employeeId(value: string) {
      const newValue = value || '';
      if (newValue !== this._employeeId) {
         this._employeeId = newValue;
         this.renderEmployeeDetails();
      }
   }

   async renderEmployeeDetails() {
      if (!this._employeeId) return;

      const cssResponse = await fetch("../../../style.css");
      const css = await cssResponse.text();

      const styleElement = document.createElement("style");
      styleElement.textContent = css;
      this.shadowRoot.appendChild(styleElement);

      const employee = await loadEmployeeDetails(Number(this._employeeId));
      const rolesMap = await this.loadRoles();

      const roleNames = employee.roles.map(roleId => rolesMap[roleId]).join(', ');

      render(this.detailTemplate(employee, roleNames), this.shadowRoot);
   }

   connectedCallback() {
      this.renderEmployeeDetails();
   }

   attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (name === "employee-id") {
         this.employeeId = newValue;
      }
   }

   detailTemplate(employee: Employee, roleNames: string) {
      return html`
         <h2>${employee.firstname} ${employee.lastname}</h2> 
         <h3><i>${employee.company_name}</i></h3>
         <p><b>Employee ID:</b> ${employee.id}</p>
         <p><b>Birthdate:</b> ${employee.birthdate}</p>
         <p><b>Email:</b> ${employee.email}</p>
         <p><b>Telephone:</b> ${employee.telephone}</p>
         <p><b>Roles:</b> ${roleNames}</p>
      `;
   }

   async loadRoles() {
      const roles = await loadAllRoles();
      return roles.reduce((acc, role) => {
         acc[role.id] = role.roleName;
         return acc;
      }, {} as Record<number, string>);
   }
}

customElements.define("employee-detail-component", EmployeeDetailComponent);