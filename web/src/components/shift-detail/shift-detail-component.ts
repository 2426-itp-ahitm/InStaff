import { html, render } from "lit-html"
import { Shift } from "../../models/shift"
import { Employee } from "../../models/employee"
import { loadShiftDetailed } from "./shift-detail-service"


class ShiftDetailComponent extends HTMLElement {
   constructor() {
      super()
      this.attachShadow({ mode: "open" })
   }

   async connectedCallback() {
      // todo: use a different css file with a different table design or use the same file with a id or class
      /*
      const cssResponse = await fetch("../../../style.css")
      const css = await cssResponse.text()

      const styleElement = document.createElement("style")
      styleElement.textContent = css

      this.shadowRoot.appendChild(styleElement)
      */
     
      const employees = await loadShiftDetailed(1)
      render(this.tableTemplate(employees), this.shadowRoot)

      const head = this.shadowRoot.querySelector("head")
      console.log("head is", head)
   }

   tableTemplate(employees: Employee[]) {
      const rows = employees.map(employee =>
         html`<tr>
               <td>${employee.firstname}</td>
               <td>${employee.lastname}</td>
            </tr>`
      )
      return html`
         <table>
            <thead>
               <tr>
                  <td>Firstname</td>
                  <td>Lastname</td>
               </tr>
            </thead>
            <tbody>
               ${rows}
            </tbody>
         </table>
      `
   }

}
customElements.define("shift-detail-component", ShiftDetailComponent)