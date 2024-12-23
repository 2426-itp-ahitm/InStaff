import { html, render } from "lit-html"
import { Shift } from "../../models/shift"
import { loadShiftDetailed } from "./shift-detail-service"
import RoleMapper from "./../../mapper/role-mapper"
import EmployeeMapper from "./../../mapper/employee-mapper"

class ShiftDetailComponent extends HTMLElement {
   private _shiftId: string = ""
   private roleMapper = new RoleMapper()
   private employeeMapper = new EmployeeMapper()

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
   set shiftId(value: string) {
      const newValue = value || ''
      if (newValue !== this._shiftId) {
         this._shiftId = newValue
         this.renderShiftDetails()
      }
   }  
   
   async renderShiftDetails() {
      if (!this._shiftId) return;

      const cssResponse = await fetch("../../../style.css")
      const css = await cssResponse.text()

      const styleElement = document.createElement("style")
      styleElement.textContent = css
      this.shadowRoot.appendChild(styleElement)
      console.log("shift id: " + this._shiftId);
      
      const shift = await loadShiftDetailed(Number(this._shiftId))
      const assignments = await this.loadAssignments(Number(this._shiftId))
      const employeeRoleData = await this.mapAssignmentsToEmployeeRoles(assignments)
      render(this.tableTemplate(shift, employeeRoleData), this.shadowRoot)
   }


   async connectedCallback() {
      this.renderShiftDetails()
   }

   async loadAssignments(shiftId: number) {
      const response = await fetch(`/api/assignments/shift/${shiftId}`)
      const assignments = await response.json()
      return assignments
   }

   async mapAssignmentsToEmployeeRoles(assignments: { employee: number; role: number }[]) {
      const employeesMap = await this.employeeMapper.loadEmployees()
      const rolesMap = await this.roleMapper.loadRoles()

      return assignments.map(assignment => ({
         employeeName: employeesMap[assignment.employee],
         roleName: rolesMap[assignment.role]
      }))
   }
   attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (name === "shift-id") {
         this.shiftId = newValue;
      }
   }

   tableTemplate(shift: Shift, employeeRoleData: { employeeName: string; roleName: string }[]) {
      return html`
         <h2>${shift.startTime.substring(0, 10)} - ${shift.endTime.substring(0, 10)}</h2>
         <h2>${shift.startTime.substring(11)} - ${shift.endTime.substring(11)}</h2>
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
      `
   }
}

customElements.define("shift-detail-component", ShiftDetailComponent)