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
import {AssignmentStatus} from '../../interfaces/AssignmentStatus';

type AssignmentStatusFilter = 'all' | 'requested' | 'request_confirmed' | 'request_declined';


@Component({
  selector: 'app-open-for-request',
  imports: [
    AsyncPipe,
    DatePipe,
    NgClass
  ],
  templateUrl: './open-for-request.component.html',
  styleUrl: './open-for-request.component.css',
})
export class OpenForRequestComponent implements OnInit{
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
    this.assignmentService.openAssignments$.subscribe(assignments => {
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

      this.assignmentService.getOpenAssignments()
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


  requestAssignment(assignment: Assignment) {
    assignment.status = AssignmentStatus.REQUESTED
    this.applyFilters();
    this.assignmentService.requestAssignment(assignment.id).subscribe(() => {
      console.log("requested")
      this.loadAssignments()
    })
  }

  withdrawAssignment(assignment: Assignment) {
    assignment.status = AssignmentStatus.PENDING;
    this.applyFilters();
    this.assignmentService.withdrawAssignment(assignment.id).subscribe(() => {
      console.log("request withdrawn")
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
      if (this.selectedStatusFilter === 'requested') {
        return a.status === AssignmentStatus.REQUESTED;
      }
      if (this.selectedStatusFilter === 'request_confirmed') {
        return a.status === AssignmentStatus.REQUEST_CONFIRMED;
      }
      return a.status === AssignmentStatus.REQUEST_DECLINED;
    });

    this.fullAssignments = [...statusFiltered].sort((a, b) => {
      const aTime = new Date(a.shift.startTime).getTime();
      const bTime = new Date(b.shift.startTime).getTime();

      if (this.selectedStatusFilter === 'all') {
        const getStatusRank = (status: AssignmentStatus | null) => {
          if (status === AssignmentStatus.REQUESTED) {
            return 0;
          }
          if (status === AssignmentStatus.REQUEST_CONFIRMED) {
            return 1;
          }
          if (status === AssignmentStatus.REQUEST_DECLINED) {
            return 2;
          }
          return 3;
        };

        const statusDiff = getStatusRank(a.status) - getStatusRank(b.status);
        if (statusDiff !== 0) {
          return statusDiff;
        }
      }

      return aTime - bTime;
    });
  }

  getStatusLabel(status: AssignmentStatus | null) {
    if (status === AssignmentStatus.CONFIRMED) {
      return 'Bestätigt';
    }
    if (status === AssignmentStatus.DECLINED) {
      return 'Abgelehnt';
    }
    if (status === AssignmentStatus.REQUESTED) {
      return 'Angefragt';
    }
    if (status === AssignmentStatus.REQUEST_DECLINED) {
      return 'Anfrage abgelehnt';
    }
    if (status === AssignmentStatus.REQUEST_CONFIRMED) {
      return 'Anfrage bestätigt';
    }
    return 'Ausstehend';
  }

  getStatusClass(status: AssignmentStatus | null) {
    return {
      'bg-green-50 text-green-800 border-green-base': status === AssignmentStatus.CONFIRMED || status === AssignmentStatus.REQUEST_CONFIRMED,
      'bg-yellow-50 text-yellow-800 border-yellow-300': status === AssignmentStatus.PENDING || status === AssignmentStatus.REQUESTED,
      'bg-red-50 text-red-800 border-red-300': status === AssignmentStatus.DECLINED || status === AssignmentStatus.REQUEST_DECLINED,
    };
  }

  getCardBorderClass(status: AssignmentStatus | null) {
    return {
      'border-l-green-base':status === AssignmentStatus.CONFIRMED || status === AssignmentStatus.REQUEST_CONFIRMED,
      'border-l-yellow-400': status === AssignmentStatus.PENDING || status === AssignmentStatus.REQUESTED,
      'border-l-red-800': status === AssignmentStatus.DECLINED || status === AssignmentStatus.REQUEST_DECLINED
    };
  }

  protected readonly AssignmentStatus = AssignmentStatus;
}
