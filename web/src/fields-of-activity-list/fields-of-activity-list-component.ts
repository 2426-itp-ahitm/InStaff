import { html, render } from "lit-html"
import { FieldOfActivity } from "../models/fieldOfActivity" // Adjust the import as needed
import { loadAllFieldsOfActivitiy } from "./fields-of-activity-list-service"

const tableTemplate = (fieldsOfActivity: FieldOfActivity[]) => {
   const rows = fieldsOfActivity.map(field =>
      html`<tr>
            <td>${field.id}</td>
            <td>${field.name}</td>
         </tr>`
   )
   return html`
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

class FieldOfActivityListComponent extends HTMLElement {
   async connectedCallback(){
      const fieldsOfActivity = await loadAllFieldsOfActivity()
      render(tableTemplate(fieldsOfActivity), this)
   }
}

customElements.define("field-of-activity-list-component", FieldOfActivityListComponent)