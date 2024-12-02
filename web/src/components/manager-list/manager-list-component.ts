import { html, render } from "lit-html"
import { Manager } from "../../models/manager"
import { loadAllManagers } from "./manager-list-service"

const tableTemplate = (managers: Manager[]) => {
   const rows = managers.map(manager =>
      html`<tr>
            <td>${manager.firstname}</td>
            <td>${manager.lastname}</td>
            <td>${manager.email}</td>
            <td>${manager.telephone}</td>
            <td>${manager.birthdate.substring(0,10)}</td>
            <td>${manager.company_name}</td>
         </tr>`
   )
   return html`
   <h2>Managers</h2>
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
class ManagerListComponent extends HTMLElement {
   async connectedCallback() {
      const managers = await loadAllManagers()
      render(tableTemplate(managers), this)
   }
}
customElements.define("manager-list-component", ManagerListComponent)