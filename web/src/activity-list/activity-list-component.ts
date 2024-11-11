import { html, render } from "lit-html"
import { Activity } from "../models/Activity"
import { loadAllActivities } from "./activity-list-service"

const tableTemplate = (Activity: Activity[]) => {
   const rows = Activity.map(field =>
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

class ActivityListComponent extends HTMLElement {
   async connectedCallback(){
      const activities = await loadAllActivities()
      render(tableTemplate(activities), this)
   }
}

customElements.define("activity-list-component", ActivityListComponent)