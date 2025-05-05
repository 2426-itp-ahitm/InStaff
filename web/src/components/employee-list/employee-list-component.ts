import { html, render } from "lit-html";
import { Employee } from "../../interfaces/employee";
import { loadAllEmployees } from "../../services/employee-service";
import { model, subscribe } from "../../model/model";
import { loadAllRoles } from "../../services/roles-service";


class EmployeeListComponent extends HTMLElement {
   constructor() {
      super();
      this.attachShadow({ mode: "open" });
   }

   private isFirstClick = false;
   public isAddingEmployee = false; // State variable to track visibility

   async connectedCallback() {
      const cssResponse = await fetch("../../../style.css");
      const css = await cssResponse.text();

      const styleElement = document.createElement("style");
      styleElement.textContent = css;

      this.shadowRoot.appendChild(styleElement);
      loadAllRoles();
      

      subscribe(model => {
         console.log("Model updated:", model);
         this.render(model.employees, model.activeEmployeeId);
      });

      await loadAllEmployees();
   }

   render(employees: Employee[], activeEmployeeId: number) {
      render(this.template(employees, activeEmployeeId), this.shadowRoot);
   }

   template(employees: Employee[], activeEmployeeId: number) {
      const rows = employees.map(employee =>
         html`
            <tr @click=${() => this.showEmployeeDetail(employee.id)} class="is-clickable">
               <td>${employee.firstname}</td>
               <td>${employee.lastname}</td>
            </tr>
         `
      );

      return html`
         <div class="container">
            <h2 class="title is-3">Employees</h2>
            <table class="table is-fullwidth is-bordered is-hoverable my-1">
               <thead>
                  <tr>
                     <th>Firstname</th>
                     <th>Lastname</th>
                  </tr>
               </thead>
               <tbody>
                  ${rows}
               </tbody>
            </table>
            

            <div>
               ${model.isAddingEmployee
                  ? html`
                     <add-employee-component></add-employee-component>
                     
                  ` 
                  : html``}
                  
                  <button class="button is-primary my-1" @click=${() => this.showAddEmployee()}>
                  Add New Employee
               </button>
            
            </div>

            <div>
               ${this.isFirstClick
                  ? html`
                     <employee-detail-component .employeeId=${activeEmployeeId}></employee-detail-component>
                  `
                  : html`<p class="subtitle is-6 my-1">Select an employee to view details</p>`
               }
            </div>
         </div>
      `;
   }

   showAddEmployee() {
      model.isAddingEmployee = true; // Toggle visibility
      this.render(model.employees, model.activeEmployeeId); // Re-render
   }

   showEmployeeDetail(id: number) {
      console.log("Selected Employee ID:", id);
      model.activeEmployeeId = id;
      this.isFirstClick = true;
      this.render(model.employees, model.activeEmployeeId);
   }
}

customElements.define("employee-list-component", EmployeeListComponent);