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
      const cssResponse = await fetch("../../../style.css");
      const css = await cssResponse.text();

      const styleElement = document.createElement("style");
      styleElement.textContent = css;
      this.shadowRoot.appendChild(styleElement);

      subscribe(model => {
         console.log("Model updated:", model);
         this.render(model.shifts, model.activeShiftId);
      });

      await loadAllShifts();
   }

   render(shifts: Shift[], activeShiftId: number) {
      render(this.template(shifts, activeShiftId), this.shadowRoot);
   }

   template(shifts: Shift[], activeShiftId: number) {
      const rows = shifts.map(shift =>
         html`
            <tr @click=${() => this.showShiftDetail(shift.id)} class="is-clickable">
               <td>${shift.startTime.substring(0, 10)}</td>
               <td>${shift.startTime.substring(11)}</td>
               <td>${shift.endTime.substring(0, 10)}</td>
               <td>${shift.endTime.substring(11)}</td>
               <td>${shift.company_name}</td>
            </tr>
         `
      );

      return html`
         <div class="container">
            <h2 class="title is-3">Shifts</h2>
            <table class="table is-fullwidth is-striped is-bordered is-hoverable">
               <thead>
                  <tr>
                     <th>Start date</th>
                     <th>Start time</th>
                     <th>End date</th>
                     <th>End time</th>
                     <th>Company name</th>
                  </tr>
               </thead>
               <tbody>
                  ${rows}
               </tbody>
            </table>
            ${activeShiftId
               ? html`
                   <shift-detail-component .shiftId=${activeShiftId}></shift-detail-component>
                 `
               : html`<p class="subtitle">Select a shift to view details</p>`
            }
         </div>
      `;
   }

   showShiftDetail(id: number) {
      console.log("showShiftDetail", id);
      model.activeShiftId = id;
   }
}

customElements.define("shift-list-component", ShiftListComponent);