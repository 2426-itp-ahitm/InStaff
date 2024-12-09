import { html, render } from "lit-html"
import { Employee } from "../../models/employee"
import { loadAllEmployees } from "./employee-list-service"


class EmployeeListComponent extends HTMLElement {
   constructor() {
      super()
      this.attachShadow({ mode: "open" })
   }

   async connectedCallback() {
      const cssResponse = await fetch("../../../style.css")
      const css = await cssResponse.text()

      const styleElement = document.createElement("style")
      styleElement.textContent = css

      this.shadowRoot.appendChild(styleElement)

      const employees = await loadAllEmployees()
      render(this.tableTemplate(employees), this.shadowRoot)
      const head = this.shadowRoot.querySelector("head")
      console.log("head is", head)
   }

   tableTemplate (employees: Employee[]) {
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
   
}
customElements.define("employee-list-component", EmployeeListComponent)