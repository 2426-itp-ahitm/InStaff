import { html, render } from "lit-html"
import { Employee } from "../../models/employee"
import { loadAllEmployees } from "./employee-list-service"

const tableTemplate = (employees: Employee[]) => {
   const rows = employees.map(employee =>
      html`<tr>
            <td>${employee.firstname}</td>
            <td>${employee.lastname}</td>
            <td>${employee.email}</td>
            <td>${employee.telephone}</td>
            <td>${employee.birthdate}</td>
            <td>${employee.companyid}</td>
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
               <td>Company ID</td>
            </tr>
         </thead>
         <tbody>
            ${rows}
         </tbody>
      </table>
   `
}
class EmployeeListComponent extends HTMLElement {
   async connectedCallback() {
      const employees = await loadAllEmployees()
      render(tableTemplate(employees), this)
   }
}
customElements.define("employee-list-component", EmployeeListComponent)