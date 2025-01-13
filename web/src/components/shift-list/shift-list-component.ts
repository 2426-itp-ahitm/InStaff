import { html, render } from "lit-html"
import { Shift } from "../../models/shift"
import { loadAllShifts } from "./shift-list-service"

class ShiftListComponent extends HTMLElement {
   activeShiftId: number = 0
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

      const shifts = await loadAllShifts()
      this.shifts = shifts  // Speichere die Shifts für später
      render(this.tableTemplate(shifts), this.shadowRoot)
   }

   tableTemplate(shifts: Shift[]) {
      const rows = shifts.map(shift =>
         html`<tr @click=${() => this.showShiftDetail(shift.id)}>
               <td>${shift.startTime.substring(0,10)}</td>
               <td>${shift.startTime.substring(11)}</td>
               <td>${shift.endTime.substring(0, 10)}</td>
               <td>${shift.endTime.substring(11)}</td>
               <td>${shift.company_name}</td>
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
               </tr>
            </thead>
            <tbody>
               ${rows}
            </tbody>
         </table>

         <!-- Dynamische Anzeige des ShiftDetailComponents -->
         <shift-detail-component .shift-id=${this.activeShiftId}></shift-detail-component>
      `
   }

   showShiftDetail(id: number) {
      console.log("showShiftDetail", id)
      this.activeShiftId = id
      this.reloadShiftDetail()
   }

   reloadShiftDetail() {
      const detailComponent = this.shadowRoot.querySelector("shift-detail-component")
      if (detailComponent) {
         detailComponent.setAttribute('shift-id', this.activeShiftId.toString())
      }
   }
}

customElements.define("shift-list-component", ShiftListComponent)