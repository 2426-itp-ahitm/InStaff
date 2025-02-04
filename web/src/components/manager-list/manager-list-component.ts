import { html, render } from "lit-html"
import { Manager } from "../../interfaces/manager"
import { loadAllManagers } from "./manager-list-service"


class ManagerListComponent extends HTMLElement {
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

      const managers = await loadAllManagers()
      render(this.tableTemplate(managers), this.shadowRoot)
   }

   tableTemplate(managers: Manager[]) {
      const rows = managers.map(manager =>
         html`<tr>
               <td>${manager.firstname}</td>
               <td>${manager.lastname}</td>
               <td>${manager.email}</td>
               <td>${manager.telephone}</td>
               <td>${manager.birthdate.substring(0, 10)}</td>
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
}
customElements.define("manager-list-component", ManagerListComponent)