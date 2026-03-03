import {Component, inject, OnInit} from '@angular/core';
import {ShiftServiceService} from '../../shift/shift-service/shift-service.service';
import {AssignmentServiceService} from '../../services/assignment-service/assignment-service.service';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {KeycloakService} from 'keycloak-angular';
import {RoleServiceService} from '../../role/role-service/role-service.service';
import {AssignmentFull} from '../../interfaces/assignment-full';
import {Shift} from '../../interfaces/shift';
import {filter, forkJoin} from 'rxjs';
import {map} from 'rxjs/operators';
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {Employee} from '../../interfaces/employee';
import {log} from '@angular-devkit/build-angular/src/builders/ssr-dev-server';

@Component({
  selector: 'app-employee-shift-overview',
  imports: [
    NgForOf,
    DatePipe,
    NgIf,
    NgClass,
    AsyncPipe
  ],
  templateUrl: './employee-shift-overview.component.html',
  styleUrl: './employee-shift-overview.component.css'
})
export class EmployeeShiftOverviewComponent implements OnInit{
  shiftService: ShiftServiceService = inject(ShiftServiceService)
  assignmentService: AssignmentServiceService = inject(AssignmentServiceService)
  roleService: RoleServiceService = inject(RoleServiceService)
  keycloakService: KeycloakService = inject(KeycloakService)
  employeeService: EmployeeServiceService = inject(EmployeeServiceService);
  fullAssignments: AssignmentFull[] = [];
  allAssignments: AssignmentFull[] = [];
  employee!: Employee;
  availableRoleIds = new Set<number>();
  selectedRoleIds = new Set<number>();

  ngOnInit() {
    this.roleService.getRoles()
    this.employeeService.getEmployees()
    this.loadAssignments()
  }

  loadAssignments(){
    this.employeeService.getEmployeeByKeycloakId(this.keycloakService.getKeycloakInstance().subject!).subscribe((emp) => {
      this.employee = emp;

      this.availableRoleIds = new Set(this.employee.roles.map(r => typeof r === 'number' ? r : r.roleId))
      this.selectedRoleIds = new Set(this.availableRoleIds)


      if (!emp) {
        return;
      }

      this.assignmentService.getAssignmentsForEmployee(emp.id).subscribe(
        assignments => {
          if (!assignments || assignments.length === 0) {
            this.fullAssignments = []
            return
          }
          const requests = assignments.map(a =>
            this.shiftService.getShiftById(a.shift).pipe(
              map(shift => ({
                id: a.id,
                shift: shift,
                employee: a.employee,
                role: this.roleService.getRoleById(a.role),
                confirmed: a.confirmed
              } as AssignmentFull))
            )
          )

          forkJoin(requests).subscribe(result => {
            const now = new Date().getTime()

            this.allAssignments = result
              .filter(a => {
                const end = a.shift?.endTime ? new Date(a.shift.endTime).getTime() : null
                return end !== null && end > now
              })
              .sort((a, b) => {
                const aTime = new Date(a.shift.startTime).getTime()
                const bTime = new Date(b.shift.startTime).getTime()
                return aTime - bTime
              });

            this.applyRoleFilter();
          })
        }
      )
    });
  }

  confirmAssignment(assignment: AssignmentFull) {
    this.assignmentService.confirmAssignment(assignment.id).subscribe(() => {
      console.log("confirmed")
      this.loadAssignments()
    })
  }

  declineAssignment(assignment: AssignmentFull) {
    this.assignmentService.declineAssignment(assignment.id).subscribe(() => {
      console.log("declined")
      this.loadAssignments()
    })
  }

  isShiftPastDate(shift: Shift): boolean {
    if (!shift) {
      return false
    }

    const now = new Date().getTime()
    const start = shift.startTime ? new Date(shift.startTime).getTime() : null

    if (start !== null && start <= now) {
      return true
    } return false

  }

  isRoleSelected(id: number) {
    return this.selectedRoleIds.has(id)
  }

  toggleRole(id: number) {
    if(this.selectedRoleIds.has(id)) {
      this.selectedRoleIds.delete(id)
    } else {
      this.selectedRoleIds.add(id)
    }
    console.log(this.selectedRoleIds)
    this.applyRoleFilter();
  }

  applyRoleFilter() {
    if (this.selectedRoleIds.size === 0) {
      this.fullAssignments = [];
      return;
    }

    this.fullAssignments = this.allAssignments.filter(a => {
      const roleId = typeof a.role === 'number' ? a.role : a.role?.id;
      return roleId !== undefined && this.selectedRoleIds.has(roleId);
    });
  }
}
