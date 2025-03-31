import { html, render } from "lit-html";
import { Employee } from "../../interfaces/employee";
import { Role } from "../../interfaces/role";
import { model } from "../../model/model";
import RoleMapper from "./../../mapper/role-mapper";
import { loadEmployeeDetails } from "../employee-edit/employee-edit-service";

class EmployeeDetailComponent extends HTMLElement {
   private _employeeId: string = "";
   private roleMapper = new RoleMapper();

   constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.initListeners();
   }

   // Initialize event listeners
   private initListeners() {
      document.addEventListener("keydown", this.handleKeyDown);
   }

   private handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
         this.updateEmployee();
      } else if (event.key === "Escape") {
         this.closeModal();
      }
   };

   // Cleanup event listeners to prevent memory leaks
   private destroy() {
      document.removeEventListener("keydown", this.handleKeyDown);
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
         this.closeModal();
         setTimeout(() => this.renderEmployeeDetails(), 0); // Reopen modal
      }
   }

   connectedCallback() {
      this.renderEmployeeDetails();
   }

   // Close the modal
   private closeModal() {
      model.activeEmployeeId = null;
      const modal = this.shadowRoot.getElementById("employeeModal");
      modal?.classList.remove("is-active");
   }

   // Render employee details inside the modal
   private async renderEmployeeDetails() {
      if (!this._employeeId) return;

      const cssResponse = await fetch("../../../style.css");
      const css = await cssResponse.text();
      const styleElement = document.createElement("style");
      styleElement.textContent = css;
      this.shadowRoot.appendChild(styleElement);

      let employee = model.employees.find(emp => emp.id === Number(this._employeeId));

      if (!employee) {
         await loadEmployeeDetails(Number(this._employeeId));
         employee = model.employees.find(emp => emp.id === Number(this._employeeId));
      }

      const roles = await this.loadRoles(employee);

      render(this.modalTemplate(employee, roles), this.shadowRoot);

      const modal = this.shadowRoot.getElementById("employeeModal");
      modal?.classList.add("is-active");
   }

   // Fetch roles for the employee
   private async loadRoles(employee: Employee) {
      const response = await fetch("api/roles", {
         method: "GET",
         headers: { "Content-Type": "application/json" },
      });

      return response.json().then((data: Role[]) =>
         data.map((role) => ({
            id: role.id,
            roleName: role.roleName,
            hasRole: employee.roles.includes(role.id),
         }))
      );
   }

   // Update employee details
   private async updateEmployee() {
      const firstname = this.shadowRoot.querySelector<HTMLInputElement>("#firstname")?.value;
      const lastname = this.shadowRoot.querySelector<HTMLInputElement>("#lastname")?.value;
      const email = this.shadowRoot.querySelector<HTMLInputElement>("#email")?.value;
      const telephone = this.shadowRoot.querySelector<HTMLInputElement>("#telephone")?.value;
      const birthdate = this.shadowRoot.querySelector<HTMLInputElement>("#birthdate")?.value;
      const selectedRoles = Array.from(
         this.shadowRoot.querySelectorAll<HTMLInputElement>('input[name="roles"]:checked')
      ).map((input) => Number(input.value));

      const updatedEmployee: Employee = {
         id: Number(this._employeeId),
         firstname,
         lastname,
         email,
         telephone,
         birthdate,
         password: "", // TODO: get password from the form
         company_name: model.employees.find((emp) => emp.id === Number(this._employeeId))?.company_name,
         company_id: 1, // TODO: get company_id from the form
         roles: selectedRoles,
      };

      const response = await fetch(`/api/employees/${this._employeeId}`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(updatedEmployee),
      });

      if (response.ok) {
         const employeeIndex = model.employees.findIndex((emp) => emp.id === updatedEmployee.id);
         if (employeeIndex !== -1) {
            model.employees[employeeIndex] = updatedEmployee;
         } else {
            model.employees.push(updatedEmployee);
         }
         this.closeModal();
      } else {
         console.error(`Failed to update employee: ${response.statusText}`);
      }
   }

   // Template to render employee details in the modal
   private modalTemplate(employee: Employee, roles) {
      const htmlRoles = roles.map((role) => {
         const isChecked = employee.roles.includes(role.id) ? "checked" : "";
         return html`
            <label class="checkbox">
               <input type="checkbox" name="roles" value="${role.id}" ?checked=${isChecked}> ${role.roleName}
            </label><br>
         `;
      });

      return html`
         <div id="employeeModal" class="modal">
            <div class="modal-background"></div>
            <div class="modal-content">
               <form method="dialog">
                  <header class="modal-card-head">
                     <p class="modal-card-title">Employee Details</p>
                     <button class="delete" aria-label="close" type="button" @click="${() => this.closeModal()}"></button>
                  </header>
                  <section class="modal-card-body">
                     <p><b>First Name:</b> <input type="text" id="firstname" .value="${employee.firstname}"></p>
                     <p><b>Last Name:</b> <input type="text" id="lastname" .value="${employee.lastname}"></p>
                     <p><b>Email:</b> <input type="email" id="email" .value="${employee.email}"></p>
                     <p><b>Telephone:</b> <input type="tel" id="telephone" .value="${employee.telephone}"></p>
                     <p><b>Birthdate:</b> <input type="date" id="birthdate" .value="${employee.birthdate}"></p>
                     <div><b>Roles:</b> ${htmlRoles}</div>
                  </section>
                  <footer class="modal-card-foot">
                     <button class="button is-success" type="submit" @click="${() => this.updateEmployee()}">Save Changes</button>
                     <button class="button is-danger" type="button" @click="${() => this.closeModal()}">Cancel</button>
                  </footer>
               </form>
            </div>
         </div>
      `;
   }
}

customElements.define("employee-detail-component", EmployeeDetailComponent);