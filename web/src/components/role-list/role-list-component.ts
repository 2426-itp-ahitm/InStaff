import { html, render } from "lit-html"
import { Role } from "../../interfaces/role"
import { loadAllRoles } from "./role-list-service"



class RoleListComponent extends HTMLElement {
   constructor() {
      super()
      this.attachShadow({ mode: "open" })
   }

   async connectedCallback() {
      const cssResponse = await fetch("../../../style/style.css")
      const css = await cssResponse.text()

      const styleElement = document.createElement("style")
      styleElement.textContent = css

      this.shadowRoot.appendChild(styleElement)

      const roles = await loadAllRoles()
      render(this.tableTemplate(roles), this.shadowRoot)
   }

   tableTemplate (Role: Role[]) {
      const rows = Role.map(field =>
         html`<tr>
               <td>${field.roleName}</td>
            </tr>`
      )
      return html`
      <h2>Roles</h2>
         <table>
            <thead>
               <tr>
                  <td>Name</td>
               </tr>
            </thead>
            <tbody>
               ${rows}
            </tbody>
         </table>
      `
   }
}

customElements.define("role-list-component", RoleListComponent)