import { html, render } from "lit-html"
import { Shift } from "../../models/shift"
import { loadAllShifts } from "./shift-list-service"

const tableTemplate = (shifts: Shift[]) => {
   const rows = shifts.map(shift =>
      html`<tr>
            <td>${shift.startTime}</td>
            <td>${shift.endTime}</td>
            <td>${shift.company_id}</td>
            <td>${shift.employees}</td>
         </tr>`
   )
   return html`
   <h2>Shifts</h2>
      <table>
         <thead>
            <tr>
               <td>Start time</td>
               <td>End time</td>
               <td>Company id</td>
               <td>Employees</td>
            </tr>
         </thead>
         <tbody>
            ${rows}
         </tbody>
      </table>
   `
}

class ShiftListComponent extends HTMLElement {
   async connectedCallback() {
      const shifts = await loadAllShifts()
      render(tableTemplate(shifts), this)
   }
}
customElements.define("shift-list-component", ShiftListComponent)