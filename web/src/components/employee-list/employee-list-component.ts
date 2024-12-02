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
            <td>${employee.company_name}</td>
         </tr>`
   )
   return html`
   <style>
body{
    font-family: Arial, sans-serif;
    padding: 0%;
}
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

thead {
    background-color: #333;
    color: #fff;
}

th,
td {
    padding: 10px;
    text-align: left;
    border: 1px solid #ddd;
}

tbody tr:nth-child(even) {
    background-color: #f2f2f2;
}

tbody tr:hover {
    background-color: #e0e0e0;
}

th {
    font-weight: bold;
}

td {
    color: #333;
}

thead tr td {
    color: #fff;
}

table caption {
    margin-bottom: 10px;
    font-weight: bold;
    font-size: 1.2em;
}

   </style>
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

class EmployeeListComponent extends HTMLElement {
   constructor() {
      super()
      this.attachShadow({ mode: "open" })
   }

   async connectedCallback() {
      const employees = await loadAllEmployees()
      render(tableTemplate(employees), this.shadowRoot)
      const head = this.shadowRoot.querySelector("head")
      console.log("head is", head)
   }
}
customElements.define("employee-list-component", EmployeeListComponent)