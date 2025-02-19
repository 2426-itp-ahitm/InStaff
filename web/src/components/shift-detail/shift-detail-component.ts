import { html, render } from "lit-html"
import { Shift } from "../../interfaces/shift"
import { loadShiftDetailed } from "./shift-detail-service"
import RoleMapper from "../../mapper/role-mapper"
import EmployeeMapper from "../../mapper/employee-mapper"
import { DateTime } from "luxon"
import { model, subscribe } from "../../model/model"

class ShiftDetailComponent extends HTMLElement {
   private roleMapper = new RoleMapper()
   private employeeMapper = new EmployeeMapper()
   private _shiftId: number | null = null

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
      if (value !== this._shiftId) {
         this._shiftId = value
         this.renderShiftDetails()
      } else {
         this.closeModal()
         setTimeout(() => this.renderShiftDetails(), 0)
      }
   }

   async connectedCallback() {
      subscribe(() => {
         this.shiftId = model.activeShiftId
      })
   }

   closeModal() {
      this.shadowRoot.getElementById('shiftModal')?.classList.remove('is-active')
   }

   async renderShiftDetails() {
      if (!this._shiftId) return

      const cssResponse = await fetch("../../../style.css")
      const css = await cssResponse.text()

      const styleElement = document.createElement("style")
      styleElement.textContent = css
      this.shadowRoot.appendChild(styleElement)

      const shift = await loadShiftDetailed(this._shiftId)
      const assignments = await this.loadAssignments(this._shiftId)
      const employeeRoleData = await this.mapAssignmentsToEmployeeRoles(assignments)

      this.shadowRoot.getElementById('shiftModal')?.classList.add('is-active')

      render(this.modalTemplate(shift, employeeRoleData), this.shadowRoot)
   }

   async loadAssignments(shiftId: number) {
      const response = await fetch(`/api/assignments/shift/${shiftId}`)
      return await response.json()
   }

   async mapAssignmentsToEmployeeRoles(assignments: { employee: number; role: number }[]) {
      const employeeIds = [...new Set(assignments.map(a => a.employee))]
      const roleIds = [...new Set(assignments.map(a => a.role))]

      const employeeNames = await this.employeeMapper.mapEmployeeIdsToNames(employeeIds)
      const roleNames = await this.roleMapper.mapRoleIdsToNames(roleIds)

      const employeeMap = Object.fromEntries(employeeIds.map((id, index) => [id, employeeNames[index]]))
      const roleMap = Object.fromEntries(roleIds.map((id, index) => [id, roleNames[index]]))

      return assignments.map(a => ({
         employeeName: employeeMap[a.employee],
         roleName: roleMap[a.role]
      }))
   }

   modalTemplate(shift: Shift, employeeRoleData: { employeeName: string; roleName: string }[]) {
      const shiftStart = DateTime.fromISO(shift.startTime)
      const shiftEnd = DateTime.fromISO(shift.endTime)

      const formattedDate = shiftStart.toLocaleString(DateTime.DATE_HUGE)
      const formattedTime = `${shiftStart.toFormat("HH:mm")} - ${shiftEnd.toFormat("HH:mm")}`

      return html`
         <div class="modal" id="shiftModal">
            <div class="modal-background"></div>
            <div class="modal-card">
               <header class="modal-card-head">
                  <p class="modal-card-title">
                     <time datetime="${shift.startTime}">${formattedDate}</time>
                     <span class="time">${formattedTime}</span>
                  </p>
                  <button class="delete" aria-label="close" @click=${() => this.closeModal()}></button>
               </header>
               <section class="modal-card-body">
                  <h3 class="">${shift.company_name}</h3>
                  <h2 style="font-weight: bold">Employees:</h2>
                  <table>
                     <tbody>
                        ${employeeRoleData.map(
                           data => html`
                              <tr>
                                 <td>${data.employeeName}</td>
                                 <td>${data.roleName}</td>
                              </tr>
                           `
                        )}
                     </tbody>
                  </table>
               </section>
               <footer class="modal-card-foot">
                  <button class="button" @click=${() => this.closeModal()}>Close</button>
               </footer>
            </div>
         </div>
      `
   }
}

customElements.define("shift-detail-component", ShiftDetailComponent)