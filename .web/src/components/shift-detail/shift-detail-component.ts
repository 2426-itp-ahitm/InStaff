import { html, render } from "lit-html"
import { Shift } from "../../interfaces/shift"
import { loadShiftDetailed } from "./shift-detail-service"
import { loadReservationsFromShift } from "../../services/reservation-service"
import RoleMapper from "../../mapper/role-mapper"
import EmployeeMapper from "../../mapper/employee-mapper"
import { DateTime } from "luxon"
import { model, subscribe } from "../../model/model"
import { Employee } from "src/interfaces/employee"
import { Role } from "src/interfaces/role"
//import { loadAllEmployees } from "src/services/employee-service"

class ShiftDetailComponent extends HTMLElement {
   private roleMapper = new RoleMapper()
   private employeeMapper = new EmployeeMapper()
   private _shiftId: number | null = null
   private empRoles: number[] = [1,2,3,4,5]
   private temRoles: String[] = ["---","Koch", "Kochhilfe", "Service", "Bar", "Barkeeper"]

   constructor() {
      super()
      this.attachShadow({ mode: "open" })
   }
 
   static get observedAttributes() {
      return ['shift-id']
   }

   get shiftId() {
      return this._shiftId
   }

   set shiftId(value: number | null) {
      if (this._shiftId === value) {
         this.renderShiftDetails();
      } else {
         this._shiftId = value;
         this.renderShiftDetails();
      }
   }

   async connectedCallback() {
      subscribe(() => {
         this.shiftId = model.activeShiftId
      })
   }

   closeModal() {
      const modal = this.shadowRoot.getElementById("shiftModal");
      if (modal) {
         modal.classList.remove("is-active");
      }
      model.activeShiftId = null;
   }

   async renderShiftDetails() {
      if (!this._shiftId) return;

 
      /* Remove only the modal element before re-rendering
      const existingModal = this.shadowRoot.getElementById("shiftModal");
      
      if (existingModal) {
         existingModal.remove();
      }
      */
      const cssResponse = await fetch("../../../style.css");
      const css = await cssResponse.text();
      const styleElement = document.createElement("style");
      styleElement.textContent = css;
      this.shadowRoot.appendChild(styleElement);

      const shift = await loadShiftDetailed(this._shiftId);
      const assignments = await this.loadAssignments(this._shiftId);
      const employeeRoleData = await this.mapAssignmentsToEmployeeRoles(assignments);
      const reservations = await loadReservationsFromShift(this._shiftId);
      const employees = model.employees

      render(this.modalTemplate(shift, employeeRoleData, reservations, employees), this.shadowRoot)
      await new Promise(resolve => requestAnimationFrame(resolve));

      const modal = this.shadowRoot.getElementById("shiftModal") as HTMLDialogElement;
      if (modal) {
         modal.classList.add("is-active");
      }
   }

   async loadAssignments(shiftId: number) {
      const response = await fetch(`/api/assignments/shift/${shiftId}`)
      return await response.json()
   }

   async mapAssignmentsToEmployeeRoles(assignments: { employee: number; role: number; confirmed: boolean }[]) {
      const employeeIds = [...new Set(assignments.map(a => a.employee))]
      const roleIds = [...new Set(assignments.map(a => a.role))]
      const confirmed = [...new Set(assignments.map(a => a.confirmed))]

      const employeeNames = await this.employeeMapper.mapEmployeeIdsToNames(employeeIds)
      const roleNames = await this.roleMapper.mapRoleIdsToNames(roleIds)

      const employeeMap = Object.fromEntries(employeeIds.map((id, index) => [id, employeeNames[index]]))
      const roleMap = Object.fromEntries(roleIds.map((id, index) => [id, roleNames[index]]))

      return assignments.map(a => ({
         employeeName: employeeMap[a.employee],
         roleName: roleMap[a.role],
         confirmed: a.confirmed
      }))
   }

   modalTemplate(
      shift: Shift,
      employeeRoleData: { employeeName: string; roleName: string; confirmed: boolean }[],
      reservations: { id: number; name: string; infos: string; number_of_people: number; start_time: string; end_time: string; shift: number }[],
      employees: Employee[]
   ) {
      const shiftStart = DateTime.fromISO(shift.startTime);
      const shiftEnd = DateTime.fromISO(shift.endTime);

      let formattedDate: string;

      if (shiftStart.hasSame(shiftEnd, "day") && shiftStart.hasSame(shiftEnd, "month") && shiftStart.hasSame(shiftEnd, "year")) {
         formattedDate = shiftStart.toLocaleString(DateTime.DATE_HUGE) + ` ${shiftStart.toFormat("HH:mm")}` +
            " - " +
            shiftEnd.toFormat("HH:mm");      
      } else {
         formattedDate = shiftStart.toLocaleString(DateTime.DATE_MID) + ` ${shiftStart.toFormat("HH:mm")}` +
            " - " +
            shiftEnd.toLocaleString(DateTime.DATE_MID) + ` ${shiftEnd.toFormat("HH:mm")}`;
      }

      return html`
         <div id="shiftModal" class="modal">
            <div class="modal-background"></div>
            <div class="modal-content">
               <form method="dialog">
                  <header class="modal-card-head">
                     <p class="modal-card-title">
                        <time datetime="${shift.startTime}">${formattedDate}</time>
                     </p>
                     <button class="delete" aria-label="close" type="button" @click="${() => this.closeModal()}"></button>
                  </header>
                  <section class="modal-card-body">
                     <h3 class="">${shift.company_name}</h3>
                     <h2 style="font-weight: bold">Employees:</h2>
                     <table class="styled-table">
                        <tbody>
                           ${employeeRoleData.map(
                              data => html`
                                 <tr>
                                    <td>${data.employeeName}</td>
                                    <td>${data.roleName}</td>
                                    <td>${data.confirmed === true ? html`
                                       <p class="subtitle is-6 my-1 has-text-success">Confirmed</p>
                                     ` : data.confirmed === false ? html`
                                       <p class="subtitle is-6 my-1 has-text-danger">Dismissed</p>
                                     ` : html`
                                       <p class="subtitle is-6 my-1 has-text-warning">Not confirmed yet</p>
                                     `
                                   }</td>
                                 </tr>
                              `
                           )}
                           <tr>
                              <td>
                                <select class="select" id="employeeSelect">
                                  ${employees.map(employee => html`
                                    <option value="${employee.id}" @click="${() => {this.empRoles = employee.roles; console.log(this.empRoles)}}" > ${employee.firstname} ${employee.lastname} </option>
                                  `)}
                                </select>
                              </td>
                              <td>
                                 <select class="select" id="roleSelect">
                                    ${this.temRoles.map(role => html`
                                       <option value="${role}">${role}</option>
                                    `)}
                                 </select>
                              </td>
                              <td><button class="button" type="button" >Send Request</button></td>
                           </tr>
                        </tbody>
                     </table>
                     <h2 style="font-weight: bold; margin-top: 1em;">Reservations:</h2>
                     <table class="styled-table">
                        <thead>
                           <tr>
                              <th>Name</th>
                              <th>Infos</th>
                              <th>People</th>
                              <th>Start</th>
                              <th>End</th>
                           </tr>
                        </thead>
                        <tbody>
                           ${reservations.map(reservation => html`
                              <tr>
                                 <td>${reservation.name}</td>
                                 <td>${reservation.infos || "-"}</td>
                                 <td>${reservation.number_of_people}</td>
                                 <td>${reservation.start_time}</td>
                                 <td>${reservation.end_time}</td>
                              </tr>
                           `)}
                        </tbody>
</table>
                  </section>
                  <footer class="modal-card-foot">
                     <button class="button" type="button" @click="${() => this.closeModal()}">Close</button>
                  </footer>
               </form>
            </div>
         </div>
      `
   }



   loadRoleForEmp(id: number) {
      

   }
}

customElements.define("shift-detail-component", ShiftDetailComponent)