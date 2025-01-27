import { html, render } from "lit-html";
import { model, subscribe } from "../../model/model";
import { Shift } from "../../interfaces/shift";
import { loadAllShifts } from "./shift-list-service";

class ShiftListComponent extends HTMLElement {
   constructor() {
      super();
      this.attachShadow({ mode: "open" });
   }

   async connectedCallback() {
      // Load and apply CSS
      const cssResponse = await fetch("../../../style.css");
      const css = await cssResponse.text();

      const styleElement = document.createElement("style");
      styleElement.textContent = css;
      this.shadowRoot.appendChild(styleElement);

      // Subscribe to model updates and render when model changes
      subscribe(model => {
         console.log("Model updated:", model);
         this.render(model.shifts, model.activeShiftId);
      });

      // Load all shifts initially
      await loadAllShifts();
   }

   render(shifts: Shift[], activeShiftId: number) {
      // Render the template with the shifts and activeShiftId
      render(this.template(shifts, activeShiftId), this.shadowRoot);
   }

   template(shifts: Shift[], activeShiftId: number) {
      // Generate rows for the shifts table
      const rows = shifts.map(shift =>
         html`
            <tr @click=${() => this.showShiftDetail(shift.id)}>
               <td>${shift.startTime.substring(0, 10)}</td>
               <td>${shift.startTime.substring(11)}</td>
               <td>${shift.endTime.substring(0, 10)}</td>
               <td>${shift.endTime.substring(11)}</td>
               <td>${shift.company_name}</td>
            </tr>
         `
      );

      // Return the template for the shift list
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

         <!-- Dynamically display the shift detail component -->
         <shift-detail-component .shift-id=${activeShiftId}></shift-detail-component>
      `;
   }

   showShiftDetail(id: number) {
      // Ensure 'this' refers to the component instance when updating the model
      console.log("showShiftDetail", id);
      model.activeShiftId = id;
   }
}

customElements.define("shift-list-component", ShiftListComponent);