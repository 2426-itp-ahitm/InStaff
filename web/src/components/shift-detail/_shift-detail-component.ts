import { html, render } from "lit-html"
import { Shift } from "../../interfaces/shift"
import { loadShiftDetailed } from "./shift-detail-service"
import RoleMapper from "../../mapper/role-mapper"
import EmployeeMapper from "../../mapper/employee-mapper"
import { DateTime } from "luxon"
import { model, subscribe } from "../../model/model" // Assuming model is being used to manage the state

class ShiftDetailComponent extends HTMLElement {
   private roleMapper = new RoleMapper()
   private employeeMapper = new EmployeeMapper()

   constructor() {
      super()
      this.attachShadow({ mode: "open" })

      // Subscribe to model updates to re-render when the shiftId changes
      subscribe(() => this.renderShiftDetails())
   }

   async renderShiftDetails() {
      const shiftId = model.activeShiftId // Use model to get the active shiftId
      if (!shiftId) return;

      // Load CSS dynamically
      const cssResponse = await fetch("../../../style/style.css")
      const css = await cssResponse.text()

      const styleElement = document.createElement("style")
      styleElement.textContent = css
      this.shadowRoot.appendChild(styleElement)

      console.log("shift id: " + shiftId);
      
      // Fetch shift and assignments based on shiftId
      const shift = await loadShiftDetailed(shiftId)
      const assignments = await this.loadAssignments(shiftId)
      const employeeRoleData = await this.mapAssignmentsToEmployeeRoles(assignments)

      render(this.tableTemplate(shift, employeeRoleData), this.shadowRoot)
   }

   async connectedCallback() {
      this.renderShiftDetails() // Initial render when the component is added to the DOM
   }

   async loadAssignments(shiftId: number) {
      const response = await fetch(`/api/assignments/shift/${shiftId}`)
      const assignments = await response.json()
      return assignments
   }

   async mapAssignmentsToEmployeeRoles(assignments: { employee: number; role: number }[]) {
      const employeeIds = [...new Set(assignments.map(a => a.employee))];
        const roleIds = [...new Set(assignments.map(a => a.role))];

        const employeeNames = await this.employeeMapper.mapEmployeeIdsToNames(employeeIds);
        const roleNames = await this.roleMapper.mapRoleIdsToNames(roleIds);

        const employeeMap = Object.fromEntries(employeeIds.map((id, index) => [id, employeeNames[index]]));
        const roleMap = Object.fromEntries(roleIds.map((id, index) => [id, roleNames[index]]));

        return assignments.map(a => ({
            employeeName: employeeMap[a.employee],
            roleName: roleMap[a.role]
        }));
   }

   tableTemplate(shift: Shift, employeeRoleData: { employeeName: string; roleName: string }[]) {
      const shiftStart = DateTime.fromISO(shift.startTime)
      const shiftEnd = DateTime.fromISO(shift.endTime)

      const formattedDate = shiftStart.toLocaleString(DateTime.DATE_HUGE) // "17. Januar 2025"
      const formattedTime = `${shiftStart.toFormat("HH:mm")} - ${shiftEnd.toFormat("HH:mm")}` // "08:00 - 16:00"
   
      return html`
         <div class="shift-detail">
            <div class="shift-datetime">
               <span class="date">
                  <time datetime="${shift.startTime}">${formattedDate}</time>
               </span>
               <span class="time">${formattedTime}</span>
            </div>
            <h3>${shift.company_name}</h3>
            <table>
               <thead>
                  <tr>
                     <th>Employee Name</th>
                     <th>Role</th>
                  </tr>
               </thead>
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
         </div>
      `;
   }
}

customElements.define("shift-detail-component", ShiftDetailComponent)