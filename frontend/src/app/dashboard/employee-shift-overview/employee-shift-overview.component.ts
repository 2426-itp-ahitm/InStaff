import {Component, inject, OnInit} from '@angular/core';
import {ShiftServiceService} from '../../shift/shift-service/shift-service.service';
import {AssignmentServiceService} from '../../services/assignment-service/assignment-service.service';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {KeycloakService} from 'keycloak-angular';
import {RoleServiceService} from '../../role/role-service/role-service.service';
import {AssignmentFull} from '../../interfaces/assignment-full';
import {Shift} from '../../interfaces/shift';
import {BehaviorSubject, combineLatest, forkJoin} from 'rxjs';
import {map} from 'rxjs/operators';
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {Employee} from '../../interfaces/employee';
import {Assignment} from '../../interfaces/assignment';

type AssignmentStatusFilter = 'all' | 'open' | 'accepted' | 'declined';

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
  selectedStatusFilter: AssignmentStatusFilter = 'all';

  private employeeSubject$ = new BehaviorSubject<Employee | null>(null);

  filteredRoles$ = combineLatest([
    this.roleService.roles$, // Stream 1: Alle Rollen
    this.employeeSubject$    // Stream 2: Der aktuelle Employee
  ]).pipe(
    map(([roles, emp]) => {
      if (!emp || !emp.roles) return [];

      // Dein "Holzhammer"-Filter
      return roles.filter(role =>
        emp.roles.some(empRole => role.id === (empRole as unknown as number))
      );
    })
  );

  ngOnInit() {
    this.roleService.getRoles()
    this.employeeService.getEmployees()
    this.assignmentService.assignments$.subscribe(assignments => {
      this.buildAssignmentsFromSubject(assignments);
    });
    this.loadAssignments()
    this.setStatusFilter('open')
  }

  loadAssignments(){
    this.employeeService.getEmployeeByKeycloakId(this.keycloakService.getKeycloakInstance().subject!).subscribe((emp) => {
      this.employee = emp;

      this.employeeSubject$.next(emp);

      this.availableRoleIds = new Set(this.employee.roles.map(r => typeof r === 'number' ? r : r.roleId))
      this.selectedRoleIds = new Set(this.availableRoleIds)


      if (!emp) {
        return;
      }

      this.assignmentService.getAssignmentsForEmployee(emp.id)
    });
  }

  buildAssignmentsFromSubject(assignments: Assignment[]) {
    if (!assignments || assignments.length === 0) {
      this.allAssignments = [];
      this.fullAssignments = [];
      return;
    }

    const requests = assignments.map(assignment =>
      this.shiftService.getShiftById(assignment.shift).pipe(
        map(shift => ({
          id: assignment.id,
          shift,
          employee: assignment.employee,
          role: this.roleService.getRoleById(assignment.role),
          confirmed: assignment.confirmed
        } as AssignmentFull))
      )
    );

    forkJoin(requests).subscribe(result => {
      const now = new Date().getTime();

      this.allAssignments = result.filter(assignment => {
        const end = assignment.shift?.endTime ? new Date(assignment.shift.endTime).getTime() : null;
        return end !== null && end > now;
      });

      this.applyFilters();
    });
  }

  confirmAssignment(assignment: AssignmentFull) {
    assignment.confirmed = true;
    this.applyFilters();
    this.assignmentService.confirmAssignment(assignment.id).subscribe(() => {
      console.log("confirmed")
      this.loadAssignments()
    })
  }

  declineAssignment(assignment: AssignmentFull) {
    assignment.confirmed = false;
    this.applyFilters();
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
    this.applyFilters();
  }

  setStatusFilter(filter: AssignmentStatusFilter) {
    this.selectedStatusFilter = filter;
    this.applyFilters();
  }

  isStatusFilterSelected(filter: AssignmentStatusFilter) {
    return this.selectedStatusFilter === filter;
  }

  applyFilters() {
    if (this.selectedRoleIds.size === 0) {
      this.fullAssignments = [];
      return;
    }

    const roleFiltered = this.allAssignments.filter(a => {
      const roleId = typeof a.role === 'number' ? a.role : a.role?.id;
      return roleId !== undefined && this.selectedRoleIds.has(roleId);
    });

    const statusFiltered = roleFiltered.filter(a => {
      if (this.selectedStatusFilter === 'all') {
        return true;
      }
      if (this.selectedStatusFilter === 'open') {
        return a.confirmed === null;
      }
      if (this.selectedStatusFilter === 'accepted') {
        return a.confirmed === true;
      }
      return a.confirmed === false;
    });

    this.fullAssignments = [...statusFiltered].sort((a, b) => {
      const aTime = new Date(a.shift.startTime).getTime();
      const bTime = new Date(b.shift.startTime).getTime();

      if (this.selectedStatusFilter === 'all') {
        const getStatusRank = (confirmed: boolean | null) => {
          if (confirmed === null) {
            return 0;
          }
          if (confirmed === true) {
            return 1;
          }
          return 2;
        };

        const statusDiff = getStatusRank(a.confirmed) - getStatusRank(b.confirmed);
        if (statusDiff !== 0) {
          return statusDiff;
        }
      }

      return aTime - bTime;
    });
  }

  getStatusLabel(confirmed: boolean | null) {
    if (confirmed === true) {
      return 'Bestätigt';
    }
    if (confirmed === false) {
      return 'Abgelehnt';
    }
    return 'Ausstehend';
  }

  getStatusClass(confirmed: boolean | null) {
    return {
      'bg-green-50 text-green-800 border-green-300': confirmed === true,
      'bg-yellow-50 text-yellow-800 border-yellow-300': confirmed === null,
      'bg-red-50 text-red-800 border-red-300': confirmed === false
    };
  }

  getCardBorderClass(confirmed: boolean | null) {
    return {
      'border-l-green-500': confirmed === true,
      'border-l-yellow-400': confirmed === null,
      'border-l-red-500': confirmed === false
    };
  }
}
