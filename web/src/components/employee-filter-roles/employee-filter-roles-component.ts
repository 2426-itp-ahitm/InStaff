import { html, render } from "lit-html"
import { Employee } from "../../models/employee"
import { loadEmployeesFilteredByRole } from "./employee-filter-roles-service"

const tableTemplate = (employees: Employee[]) => {
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
   <h2>Employees</h2>
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
   async connectedCallback() {
      const employees = await loadEmployeesFilteredByRole()
      render(tableTemplate(employees), this)
   }
}
customElements.define("employee-filter-roles-component", EmployeeFilterRolesComponent)