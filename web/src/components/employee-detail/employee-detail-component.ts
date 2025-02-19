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
      } else {
         // Close the modal if the same employee is clicked
         this.closeModal();
         setTimeout(() => this.renderEmployeeDetails(), 0);  // Reopen the modal
      }
   }

   connectedCallback() {
      this.renderEmployeeDetails()
   }

   // Close the modal
   closeModal() {
      this.shadowRoot.getElementById('myModal')?.classList.remove('is-active')
   }

   async renderEmployeeDetails() {
      if (!this._employeeId) return;

      const cssResponse = await fetch("../../../style.css")
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
      // add is-active class to modal to show it
      this.shadowRoot.getElementById('myModal')?.classList.add('is-active')
      
      render(this.detailTemplate(employee, roleNames.join(', '), this), this.shadowRoot);
   }

   async updateEmployee() {
      const firstname = this.shadowRoot.querySelector<HTMLInputElement>("#firstname")?.value
      const lastname = this.shadowRoot.querySelector<HTMLInputElement>("#lastname")?.value
      const email = this.shadowRoot.querySelector<HTMLInputElement>("#email")?.value
      const telephone = this.shadowRoot.querySelector<HTMLInputElement>("#telephone")?.value
      const birthdate = this.shadowRoot.querySelector<HTMLInputElement>("#birthdate")?.value
      const roles = this.shadowRoot.querySelector<HTMLInputElement>("#roles")?.value?.split(',').map(Number)

      const updatedEmployee: Employee = {
         id: Number(this._employeeId),
         firstname,
         lastname,
         email,
         telephone,
         birthdate,
         password: '', // TODO: get password from the form
         company_name: model.employees.find(emp => emp.id === Number(this._employeeId))?.company_name,
         company_id: 1, // TODO: get company_id from the form
         roles: roles // TODO: Parse rolesInput.value to an array of role IDs
      }

      const response = await fetch(`/api/employees/${this._employeeId}`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(updatedEmployee)
      })

      if (response.ok) {
         const employeeIndex = model.employees.findIndex(emp => emp.id === updatedEmployee.id)
         if (employeeIndex !== -1) {
            model.employees[employeeIndex] = updatedEmployee
         } else {
            model.employees.push(updatedEmployee)
         }
         this.closeModal()
      } else {
         console.error(`Failed to update employee: ${response.statusText}`)
      }
   }

   attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (name === "employee-id") {
         this.employeeId = newValue;
      }
   }

   detailTemplate(employee: Employee, roleNames: string, component: EmployeeDetailComponent) {
      return html`
      <div class="modal" id="myModal">
         <div class="modal-background"></div>
         <div class="modal-card">
            <header class="modal-card-head">
               <p class="modal-card-title">
                  <input type="text" id="firstname" name="firstname" placeholder="First Name" .value="${employee.firstname}" required> 
                  <input type="text" id="lastname" name="lastname" placeholder="Last Name" .value="${employee.lastname}" required>
               </p>
               <button class="delete" aria-label="close" @click=${() => this.closeModal()}></button>
            </header>
            <section class="modal-card-body">
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
            </section>
            <footer class="modal-card-foot">
               <button class="button is-success" @click=${() => this.updateEmployee()}>Save changes</button>
               <button class="button" @click=${() => this.closeModal()}>Cancel</button>
            </footer>
         </div>
      </div>`;
   }
}

customElements.define("employee-detail-component", EmployeeDetailComponent);
