import { html, render } from "lit-html"
import { Employee } from "../../models/employee"
import { loadEmployeesFilteredByRole } from "./employee-filter-roles-service"

const tableTemplate = (employees: Employee[], onInput: (value: string) => void, onSubmit: () => void) => {
   const rows = employees.map(employee =>
      html`<tr>
            <td>${employee.firstname}</td>
            <td>${employee.lastname}</td>
            <td>${employee.email}</td>
            <td>${employee.telephone}</td>
            <td>${employee.birthdate}</td>
            <td>${employee.company_name}</td>
         </tr>`
   )
   return html`
      <h2>Filter employees after roles</h2>
      <from @submit=${(e: Event) => e.preventDefault()}>
         <label for="role_name">Role Name</label>
         <input type="text" id="role_name" name="role_name" 
            @input=${(e: Event) => onInput((e.target as HTMLInputElement).value)}
         />
         <button @click=${onSubmit}>Filter</button>
      </form>

      <table>
         <thead>
            <tr>
               <td>Firstname</td>
               <td>Lastname</td>
               <td>E-mail</td>
               <td>Tel</td>
               <td>Birthdate</td>
               <td>Company Name</td>
            </tr>
         </thead>
         <tbody>
            ${rows}
         </tbody>
      </table>
   `
}

class EmployeeFilterRolesComponent extends HTMLElement {
   inputValue: string = ""
   employees: Employee[] = []

   async connectedCallback() {
      this.renderComponent();
   }

   renderComponent() {
      render(
         tableTemplate(
            this.employees,
            (value: string) => {
               this.inputValue = value;
            },
            this.handleFilter // No binding needed as arrow functions preserve context
         ),
         this
      );
   }

   handleFilter = async () => { // Arrow function ensures `this` is correct
      if (true) {
         this.employees = await loadEmployeesFilteredByRole(this.inputValue);
         this.renderComponent();
      }
   }
}
customElements.define("employee-filter-roles-component", EmployeeFilterRolesComponent)