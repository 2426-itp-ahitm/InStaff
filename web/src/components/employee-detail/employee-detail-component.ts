import { html, render } from "lit-html";
import { Employee } from "../../interfaces/employee";
import { model } from "../../model/model";

class EmployeeDetailComponent extends HTMLElement {
   private _employeeId: string = "";
   private roles = model.roles;


   testEmployee: Employee = {
      id: -999,
      firstname: "Test",
      lastname: "Employee",
      email: "string",
      telephone: "string",
      password: "string",
      birthdate: "string",
      company_id: -9,
      company_name: "string",
      roles: [1,2]
   }

   private empHasRoles:Boolean[] = this.checkIfEmpHasRoles(this.testEmployee);


   checkIfEmpHasRoles(employee: Employee): Boolean[] {
      const empHasRoles: Boolean[] = [];
      this.roles.forEach((role) => {
         const hasRole = employee.roles.includes(role.id);
         empHasRoles.push(hasRole);
      }
      );
      return empHasRoles;
   }


   constructor() {
      super();
      this.attachShadow({ mode: "open" });
      console.log("EmployeeDetailComponent initialized" + this._employeeId);
   }

   set employeeId(value: string) {
      const newValue = value || '';
      if (newValue !== this._employeeId) {
         this._employeeId = newValue;
         this.renderEmployeeDetails();
      } else {
         //this.closeModal();
         //setTimeout(() => this.renderEmployeeDetails(), 0); // Reopen modal
      }
   }

   static get observedAttributes() {
      return ['employee-id'];
   }

   async connectedCallback() {
      console.log("Connected " + this._employeeId);

      this.renderEmployeeDetails();
   }

   private async renderEmployeeDetails() {
      render(this.template(this.testEmployee), this.shadowRoot);
   }

   template(employee: Employee) {
      const htmlRoles = this.roles.map((role, index) => {
         return html`
            <div>2
               <input type="checkbox" id="role${index}" ?checked="${this.empHasRoles[index]}">
               <label for="role${index}">${role.roleName}</label>
            </div>
         `;
      });

      return html`
         <div id="employeeModal" class="modal">
            <div class="modal-background"></div>
            <div class="modal-content">
               <form method="dialog">
                  <header class="modal-card-head">
                     <p class="modal-card-title">Employee Details: ${this._employeeId}</p>
                  </header>
                  <section class="modal-card-body">
                     <p><b>First Name:</b> <input type="text" id="firstname" .value="${employee.firstname}"></p>
                     <p><b>Last Name:</b> <input type="text" id="lastname" .value="${employee.lastname}"></p>
                     <p><b>Email:</b> <input type="email" id="email" .value="${employee.email}"></p>
                     <p><b>Telephone:</b> <input type="tel" id="telephone" .value="${employee.telephone}"></p>
                     <p><b>Birthdate:</b> <input type="date" id="birthdate" .value="${employee.birthdate}"></p>
                     <div><b>Roles:</b><br>
                        ${htmlRoles}
                     </div>
                  </section>
                  <footer class="modal-card-foot">
                  
                  </footer>
               </form>
            </div>
         </div>
      `;
   }
}

customElements.define("employee-detail-component", EmployeeDetailComponent);