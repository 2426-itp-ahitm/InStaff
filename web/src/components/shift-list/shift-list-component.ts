import { html, render } from "lit-html"
import { Shift } from "../../models/shift"
import { loadAllShifts } from "./shift-list-service"

const tableTemplate = (shifts: Shift[]) => {
   const rows = shifts.map(shift =>
      html`<tr>
            <td>${shift.startTime.substring(0,10)}</td>
            <td>${shift.startTime.substring(11, shift.startTime.length)}</td>
            <td>${shift.endTime.substring(0, 10)}</td>
            <td>${shift.endTime.substring(11, shift.endTime.length)}</td>
            <td>${shift.company_name}</td>
            <td>${shift.employees.join(', ')}</td>
         </tr>`
   )
   return html`
   <h2>Shifts</h2>
      <table>
         <thead>
            <tr>
               <td>Start date</td>
               <td>Start time</td>
               <td>End date</td>
               <td>End time</td>
               <td>Company name</td>
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
   inputValue: string = ""
   shifts: Shift[] = []

   async connectedCallback() {
      const shifts = await loadAllShifts(0)
      render(tableTemplate(shifts), this)
   }
}
customElements.define("shift-list-component", ShiftListComponent)