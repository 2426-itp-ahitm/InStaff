import { html, render } from "lit-html";
import { Employee } from "../../interfaces/employee";
import { model } from "../../model/model";
import RoleMapper from "./../../mapper/role-mapper";
import { loadEmployeeDetails } from "../employee-edit/employee-edit-service";

class EmployeeDetailComponent extends HTMLElement {
   private _employeeId: string = "";
   private roleMapper = new RoleMapper();

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

      // Hole den Mitarbeiter entweder aus dem Modell oder von der API, wenn nicht im Modell
      let employee = model.employees.find(emp => emp.id === Number(this._employeeId));
      
      if (!employee) {
         await loadEmployeeDetails(Number(this._employeeId));
         model.employees.push(employee); // Speichere den Mitarbeiter im Modell
      }

      const roleNames = await this.roleMapper.mapRoleIdsToNames(employee.roles);

      render(this.detailTemplate(employee, roleNames.join(', ')), this.shadowRoot);
   }

   async updateEmployee() {
      const shadowRoot = this.shadowRoot!;
      const employeeForm = shadowRoot.querySelector<HTMLFormElement>("#employeeForm");
      const firstnameInput = shadowRoot.querySelector<HTMLInputElement>("#firstname");
      const lastnameInput = shadowRoot.querySelector<HTMLInputElement>("#lastname");
      const emailInput = shadowRoot.querySelector<HTMLInputElement>("#email");
      const telephoneInput = shadowRoot.querySelector<HTMLInputElement>("#telephone");
      const birthdateInput = shadowRoot.querySelector<HTMLInputElement>("#birthdate");
      const rolesInput = shadowRoot.querySelector<HTMLInputElement>("#roles");

      if (employeeForm?.checkValidity()) {
         const updatedEmployee: Employee = {
            id: Number(this._employeeId),
            firstname: firstnameInput.value,
            lastname: lastnameInput.value,
            email: emailInput.value,
            telephone: telephoneInput.value,
            birthdate: birthdateInput.value,
            password: '', // TODO: get password from the form
            company_name: model.employees.find(emp => emp.id === Number(this._employeeId))?.company_name, // TODO: get company_name from the form
            company_id: 1, // TODO: get company_id from the form
            roles: [1, 2] // TODO: Parse rolesInput.value to an array of role IDs
         };
         console.log();
         

         // Update the employee in the model
         const employeeIndex = model.employees.findIndex(emp => emp.id === updatedEmployee.id);
         if (employeeIndex !== -1) {
            model.employees[employeeIndex] = updatedEmployee;
         } else {
            model.employees.push(updatedEmployee);
         }

         // Optionally, you can also update the employee on the server
         const response = await fetch(`/api/employees/${this._employeeId}`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedEmployee)
         });

         if (response.ok) {
            console.log("Employee updated successfully");
         } else {
            console.error(`Error: ${response.statusText}`);
         }
      }
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
      <form id="employeeForm">
         <h2>
            <input type="text" id="firstname" name="firstname" placeholder="First Name" .value="${employee.firstname}" required> 
            <input type="text" id="lastname" name="lastname" placeholder="Last Name" .value="${employee.lastname}" required>
         </h2>
         <h3>
            ${employee.company_name}
         </h3>
         <p>Employee ID: ${employee.id}</p>
         <p>
            <b>Birthdate:</b> 
            <input type="date" id="birthdate" name="birthdate" .value="${employee.birthdate}" required>
         </p>
         <p>
            <b>Email:</b> 
            <input type="email" id="email" name="email" placeholder="Email" .value="${employee.email}" required>
         </p>
         <p>
            <b>Telephone:</b> 
            <input type="tel" id="telephone" name="telephone" placeholder="Telephone" .value="${employee.telephone}" required>
         </p>
         <p>
            <b>Roles:</b> 
            <input type="text" id="roles" name="roles" placeholder="Roles" .value="${roleNames}" required>
         </p>
         <button @click=${() => this.updateEmployee()} type="button">Submit</button>
      </form>
      `;
   }
}

customElements.define("employee-detail-component", EmployeeDetailComponent);