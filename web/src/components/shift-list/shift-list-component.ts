import { html, render } from "lit-html"
import { Shift } from "../../models/shift"
import { loadAllShifts } from "./shift-list-service"


class ShiftListComponent extends HTMLElement {
   inputValue: string = ""
   shifts: Shift[] = []

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

      const shifts = await loadAllShifts(0)
      render(this.tableTemplate(shifts), this.shadowRoot)
   }

   tableTemplate (shifts: Shift[]) {

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
}
customElements.define("shift-list-component", ShiftListComponent)