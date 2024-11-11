import { html, render } from "lit-html"
import { Role } from "../models/role"
import { loadAllRoles } from "./role-list-service"

const tableTemplate = (Role: Role[]) => {
   const rows = Role.map(field =>
      html`<tr>
            <td>${field.id}</td>
            <td>${field.name}</td>
         </tr>`
   )
   return html`
   <h2>Roles</h2>
      <table>
         <thead>
            <tr>
               <td>ID</td>
               <td>Name</td>
            </tr>
         </thead>
         <tbody>
            ${rows}
         </tbody>
      </table>
   `
}

class RoleListComponent extends HTMLElement {
   async connectedCallback() {
      const roles = await loadAllRoles()
      render(tableTemplate(roles), this)
   }
}

customElements.define("role-list-component", RoleListComponent)