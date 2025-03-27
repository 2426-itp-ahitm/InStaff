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
      this.initListeners(); // Add event listeners
   }


   //Keyboard event listeners
   initListeners() {
      document.addEventListener("keydown", this.handleKeyDown);
   }
   handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
         this.updateEmployee();
      } else if (event.key === "Escape") {
         this.closeModal();
      }
   };
   destroy() {
      // Remove event listeners to avoid memory leaks
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
      model.activeEmployeeId = null;
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

      const employeeRoles = ["Admin", "Manager"]; // Example employee roles array

      const roles = await fetch("api/roles", {
         method: "GET",
         headers: { "Content-Type": "application/json" }
      })
         .then(response => response.json())
         .then((data: Role[]) => 
             data.map(role => ({
                 id: role.id,
                 roleName: role.roleName,
                 hasRole: employee.roles.includes(role.id) // Checks if employee has this role
             }))
         )
         .catch(error => {
             console.error(`Failed to fetch roles: ${error}`);
             return [];
         });
             
      console.log(roles); // This will log an array of objects with id and roleName
      
      // add is-active class to modal to show it
      this.shadowRoot.getElementById('myModal')?.classList.add('is-active')
      
      render(this.detailTemplate(employee, roles, this), this.shadowRoot);
   }

   async updateEmployee() {
      const firstname = this.shadowRoot.querySelector<HTMLInputElement>("#firstname")?.value
      const lastname = this.shadowRoot.querySelector<HTMLInputElement>("#lastname")?.value
      const email = this.shadowRoot.querySelector<HTMLInputElement>("#email")?.value
      const telephone = this.shadowRoot.querySelector<HTMLInputElement>("#telephone")?.value
      const birthdate = this.shadowRoot.querySelector<HTMLInputElement>("#birthdate")?.value
      const selectedRoles = Array.from(
         this.shadowRoot.querySelectorAll<HTMLInputElement>('input[name="roles"]:checked')
      ).map(input => Number(input.value));  //TODO: if user changes roles, update employee.roles
      console.log("########selected roles#########")
      console.log(selectedRoles); // This will log an array of role IDs

//des is a ssh kommentar tst 
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
         roles: selectedRoles // TODO: Parse rolesInput.value to an array of role IDs
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

   detailTemplate(employee: Employee, roles, component: EmployeeDetailComponent) {
      const htmlRoles = roles.map(role => {
         const isChecked = employee.roles.includes(role.id) ? 'checked' : '';
         return html`
             <label class="checkbox">
                 <input type="checkbox" name="roles" value="${role.id}" ?checked=${isChecked}> ${role.roleName}
             </label><br>
         `;
     });
            


      return html`
      <div class="modal" id="myModal">
         <div class="modal-background"></div>
         <div class="modal-card">
            <header class="modal-card-head">
               <div class="modal-card-title grid mb-0 ">
                  <input type="text" class="input cell " id="firstname" name="firstname" placeholder="First Name" .value="${employee.firstname}" required> 
                  <input type="text" class="input cell" id="lastname" name="lastname" placeholder="Last Name" .value="${employee.lastname}" required>
               </div>
            </header>
            <section class="modal-card-body py-2">
               <h3>
                  ${employee.company_name}
               </h3>
               <p>Employee ID: ${employee.id}</p>
               <p>
                  <b>Birthdate:</b> 
                  <input type="date" class="input" id="birthdate" name="birthdate" .value="${employee.birthdate}" required>
               </p>
               <p>
                  <b>Email:</b> 
                  <input type="email" class="input" id="email" name="email" placeholder="Email" .value="${employee.email}" required>
               </p>
               <p>
                  <b>Telephone:</b> 
                  <input type="tel" class="input" id="telephone" name="telephone" placeholder="Telephone" .value="${employee.telephone}" required>
               </p>
               <p>
                  <b>Roles:</b> 
               </p>
               <form>
                  ${htmlRoles}
               </form>
            </section>
            <footer class="modal-card-foot">
               <button class="button is-success mx-1" @click=${() => this.updateEmployee()}>Save changes</button>
               <button class="button is-danger mx-1" @click=${() => this.closeModal()}>Cancel</button>
            </footer>
         </div>
      </div>`;
   }
}

customElements.define("employee-detail-component", EmployeeDetailComponent);
