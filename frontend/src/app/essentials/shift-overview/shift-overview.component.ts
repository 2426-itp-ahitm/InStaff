import {Component, inject, Input, OnInit} from '@angular/core';
import {AsyncPipe, DatePipe, NgClass} from '@angular/common';
import {AssignmentServiceService} from '../../services/assignment-service/assignment-service.service';
import {RoleServiceService} from '../../role/role-service/role-service.service';
import {KeycloakService} from 'keycloak-angular';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {Assignment} from '../../interfaces/assignment';
import {Employee} from '../../interfaces/employee';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {ShiftShort} from '../../interfaces/shift-short';

type AssignmentStatusFilter = 'all' | 'open' | 'accepted' | 'declined';

@Component({
  selector: 'app-shift-overview',
  imports: [
    AsyncPipe,
    DatePipe,
    NgClass
  ],
  templateUrl: './shift-overview.component.html',
  styleUrl: './shift-overview.component.css'
})
export class ShiftOverviewComponent implements OnInit{
  @Input() stickyTop: string = '0rem';

  assignmentService: AssignmentServiceService = inject(AssignmentServiceService)
  roleService: RoleServiceService = inject(RoleServiceService)
  keycloakService: KeycloakService = inject(KeycloakService)
  employeeService: EmployeeServiceService = inject(EmployeeServiceService);
  fullAssignments: Assignment[] = [];
  allAssignments: Assignment[] = [];
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

      const employeeRoleIds = new Set(
        emp.roles.map(role => typeof role === 'number' ? role : role.id)
      );

      return roles.filter(role => employeeRoleIds.has(role.id));
    })
  );

  ngOnInit() {
    this.roleService.getRoles()
    this.employeeService.getAllEmployees()
    this.assignmentService.assignments$.subscribe(assignments => {
      this.buildAssignmentsFromSubject(assignments);
    });
    this.loadAssignments()
    //this.setStatusFilter('open')
  }

  loadAssignments(){
    this.employeeService.getEmployeeByKeykloackId(this.keycloakService.getKeycloakInstance().subject!).subscribe((emp) => {
      this.employee = emp;

      this.employeeSubject$.next(emp);

      this.availableRoleIds = new Set(this.employee.roles.map(r => typeof r === 'number' ? r : r.id))
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
    const now = new Date().getTime();

    this.allAssignments = assignments.filter(assignment => {
      const end = assignment.shift?.endTime ? new Date(assignment.shift.endTime).getTime() : null;
      return end !== null && end > now;
    });

    this.applyFilters();
  }


  confirmAssignment(assignment: Assignment) {
    assignment.confirmed = true;
    this.applyFilters();
    this.assignmentService.confirmAssignment(assignment.id).subscribe(() => {
      console.log("confirmed")
      this.loadAssignments()
    })
  }

  declineAssignment(assignment: Assignment) {
    assignment.confirmed = false;
    this.applyFilters();
    this.assignmentService.declineAssignment(assignment.id).subscribe(() => {
      console.log("declined")
      this.loadAssignments()
    })
  }

  isShiftPastDate(shift: ShiftShort): boolean {
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
      'bg-green-50 text-green-800 border-green-base': confirmed === true,
      'bg-yellow-50 text-yellow-800 border-yellow-300': confirmed === null,
      'bg-red-50 text-red-800 border-red-300': confirmed === false
    };
  }

  getCardBorderClass(confirmed: boolean | null) {
    return {
      'border-l-green-base': confirmed === true,
      'border-l-yellow-400': confirmed === null,
      'border-l-red-800': confirmed === false
    };
  }

}
