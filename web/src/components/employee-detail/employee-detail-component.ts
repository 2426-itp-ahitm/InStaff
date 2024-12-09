import { html, render } from "lit-html";
import { Employee } from "../../models/employee";
import { loadEmployeeDetails } from "./employee-detail-service";

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
      render(this.detailTemplate(employee), this.shadowRoot);
   }

   connectedCallback() {
      this.renderEmployeeDetails();
   }

   attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (name === "employee-id") {
         this.employeeId = newValue;
      }
   }

   detailTemplate(employee: Employee) {
      return html`
      <p>${employee.firstname}</p>
      <p>${employee.lastname}</p>
      <p>${employee.email}</p>
      <p>${employee.telephone}</p>
      <p>${employee.birthdate}</p>
      <p>${employee.company_name}</p>

      `;
   }
}

customElements.define("employee-detail-component", EmployeeDetailComponent);