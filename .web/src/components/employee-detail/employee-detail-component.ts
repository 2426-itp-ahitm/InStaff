import { html, render, TemplateResult } from "lit-html";
import { Employee } from "../../interfaces/employee";
import { model } from "../../model/model";
import { Role } from "../../interfaces/role";
import { loadAllRoles } from "../../services/roles-service";

class EmployeeDetailComponent extends HTMLElement {

   constructor() {
      super();      
      this.attachShadow({ mode: "open" });
      loadAllRoles();
      console.log("EmployeeDetailComponent initialized" + this._employeeId);
   }


   private _employeeId: string = "";
   private roles = model.roles;
   
   

   selEmp: Employee = {
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

   private empHasRoles:Boolean[] = [];


   checkIfEmpHasRoles(employee: Employee): Boolean[] {
      const empHasRoles: Boolean[] = [];
      this.roles.forEach((role) => {
         const hasRole = employee.roles.includes(role.id);
         empHasRoles.push(hasRole);
      }
      );
      console.log("empHasRoles: " + empHasRoles);
      return empHasRoles;
   }
   

  

   set employeeId(value: string) {
      const newValue = value || '';
      if (newValue !== this._employeeId) {
         this._employeeId = newValue;
         this.getEmployeeDetails(this._employeeId);
      } else {
         //this.closeModal();
         //setTimeout(() => this.renderEmployeeDetails(), 0); // Reopen modal
      }
   }

   async getEmployeeDetails(_employeeId: string) {
      console.log("Fetching employee details for ID: " + _employeeId);
      await fetch(`/api/employees/${_employeeId}`)
         .then(response => response.json())
         .then(data => {
            this.selEmp = data;
            this.empHasRoles = this.checkIfEmpHasRoles(this.selEmp);
      });
      const htmlRoles = this.roles.map((role, index) => {
         return html`
            <div>
               <input type="checkbox" id="role${index}" ?checked="${this.empHasRoles[index]}">
               <label for="role${index}">${role.roleName}</label>
            </div>
         `;
      });
      this.renderEmployeeDetails(htmlRoles);

   }

   static get observedAttributes() {
      return ['employee-id'];
   }

   async connectedCallback() {
      const cssResponse = await fetch("../../../style.css");
      const css = await cssResponse.text();
      const styleElement = document.createElement("style");
      styleElement.textContent = css;
      this.shadowRoot?.appendChild(styleElement);      
      console.log("Connected " + this._employeeId);
   }

   

   private async renderEmployeeDetails(htmlRoles: TemplateResult<1>[]) {
      render(this.template(this.selEmp, htmlRoles), this.shadowRoot);
   }

   
   
   
   template(employee: Employee, htmlRoles: TemplateResult<1>[]) {
      
      return html`
         <div class="box">    
            <div class="">
               <div class="field">
                  <label for="firstname" class="label">First Name</label>
                  <div class="control">
                     <input type="text" id="firstname" name="firstname" class="input" .value=${employee.firstname} placeholder="First Name" />
                  </div>
               </div>

               <div class="field">
                  <label for="lastname" class="label">Last Name</label>
                  <div class="control">
                     <input type="text" id="lastname" name="lastname" class="input" .value=${employee.lastname} placeholder="Last Name" />
                  </div>
               </div>

               <div class="field">
                  <label for="email" class="label">Email</label>
                  <div class="control">
                     <input type="email" id="email" name="email" class="input" .value=${employee.email} placeholder="Email" />
                  </div>
               </div>

               <div class="field">
                  <label for="telephone" class="label">Telephone</label>
                  <div class="control">
                     <input type="text" id="telephone" name="telephone" class="input" .value=${employee.telephone} placeholder="Telephone" />
                  </div>
               </div>

               <div class="field">
                  <label for="birthdate" class="label">Birthdate</label>
                  <div class="control">
                     <input type="date" id="birthdate" name="birthdate" class="input" .value=${employee.birthdate} />
                  </div>
               </div>

               ${htmlRoles}
                
            </div>

            <div class="">
               <button class="button is-success" @click=${() => this.saveEmployeeDetails(employee)}>Save changes</button>
               <button class="button" @click=${() => this.closeModal()}>Cancel</button>
            </div>
         </div>
         
      
      `;
   }
   closeModal() {
      const modal = this.shadowRoot?.getElementById("employeeModal");
      if (modal) {
         modal.classList.remove("is-active");
      }
   }
   saveEmployeeDetails(employee: Employee) {
   }
}

customElements.define("employee-detail-component", EmployeeDetailComponent);

