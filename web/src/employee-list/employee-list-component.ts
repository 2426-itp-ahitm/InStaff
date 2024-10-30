import { html, render } from "lit-html"
import { Employee } from "../models/employee"
import { loadAllEmployees } from "./employee-list-service"

const tableTemplate = (employees: Employee[]) => {
   const rows = employees.map(employee =>
      html`<tr>
            <td>${employee.id}</td>
            <td>${employee.firstname}</td>
            <td>${employee.lastname}</td>
            <td>${employee.email}</td>
            <td>${employee.telefon}</td>
            <td>${employee.birthdate}</td>
            <td>${employee.company_id}</td>
         </tr>`
   )
   return html`
      <table>
         <thead>
            <tr>
               <td>ID</td>
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
   async connectedCallback(){
      const employees = await loadAllEmployees()
      render(tableTemplate(employees), this)
   }
}
customElements.define("employee-list-component", EmployeeListComponent)