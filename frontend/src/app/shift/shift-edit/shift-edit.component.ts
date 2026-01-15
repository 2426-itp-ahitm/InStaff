import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {Shift} from '../../interfaces/shift';
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {NewShift} from '../../interfaces/new-shift';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {ShiftServiceService} from '../shift-service/shift-service.service';
import {Employee} from '../../interfaces/employee';
import {NewAssignment} from '../../interfaces/new-assignment';
import {RoleServiceService} from '../../role/role-service/role-service.service';
import {AssignmentServiceService} from '../../services/assignment-service/assignment-service.service';
import {Assignment} from '../../interfaces/assignment';
import {Role} from '../../interfaces/role';

@Component({
  selector: 'app-shift-edit',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './shift-edit.component.html',
  styleUrl: './shift-edit.component.css'
})
export class ShiftEditComponent implements OnInit {
  @Output() closeShiftEdit = new EventEmitter<unknown>();

  @Input() shiftId!: number;
  roles!: Role[];
  shift!: Shift;

  companyService:CompanyServiceService = inject(CompanyServiceService);
  employeeService:EmployeeServiceService = inject(EmployeeServiceService);
  shiftService:ShiftServiceService = inject(ShiftServiceService);
  roleService:RoleServiceService = inject(RoleServiceService);
  assignmentService:AssignmentServiceService = inject(AssignmentServiceService);

  roleNameMap: { [id: number]: string } = {};
  employees: Employee[] = [];
  assignments: Assignment[] = [];
  availableRoles: Role[] = [];
  selectedNewRoleId: number = -1;
  groupedAssignments: { roleId: number, roleName: string, assignments: Assignment[], count: number }[] = [];
  employeesByRole: { [roleId: number]: Employee[] } = {};
  somethingChanged: boolean = false;
  
  private rolesLoaded = false;
  private assignmentsLoaded = false;

  somethingChangedSetTrue(){
    this.somethingChanged = true
  }
  
  private updateGroupedIfReady() {
    if (this.rolesLoaded && this.assignmentsLoaded) {
      this.updateGroupedAssignments();
      this.updateAvailableRoles();
    }
  }

  ngOnInit(): void {

    this.shiftService.getShiftById(this.shiftId).subscribe((s: Shift) => {
      console.log(s);
      this.shift = s
      console.log(this.shift);
    })

    this.assignmentService.getAssignmentByShiftId(this.shiftId).subscribe((a: Assignment[]) => {
      this.assignments = a;
      this.assignmentsLoaded = true;
      this.updateGroupedIfReady();
    })


    //get all Employees
    this.employeeService.getEmployees()
    this.employeeService.employees$.subscribe((e) => {
      this.employees = e;
      this.updateEmployeesByRole();
    })

    //gets all Roles
    this.roleService.getRoles()
    this.roleService.roles$.subscribe((roles) => {
      this.roles = roles;
      this.roleNameMap = roles.reduce((map, role) => {
        map[role.id] = role.roleName;
        return map;
      }, {} as { [id: number]: string });
      this.rolesLoaded = true;
      this.updateGroupedIfReady();
    });



  }




  save() {
    // Filtere nur gültige Zuweisungen (mit zugewiesenem Mitarbeiter)
    const validAssignments: NewAssignment[] = this.assignments
      .filter(a => a.employee !== 0) // Nur Zuweisungen mit zugewiesenem Mitarbeiter
      .map(a => ({
        employee: a.employee,
        role: a.role
      }));

    const newShift: NewShift = {
      shiftCreateDTO: {
        startTime: this.shift.startTime,
        endTime: this.shift.endTime,
        companyId: this.shift.companyId,
      },
      assignmentCreateDTOs: validAssignments,
    };
    console.log("updating1");

    // If editing an existing shift, call update; otherwise fallback to add
    if (this.shift && this.shift.id) {
      this.shiftService.updateShift(this.shift.id, newShift).subscribe({
        next: () => {
          this.closeEditShift();
          console.log("updating2");
        },
        error: (err) => {
          console.error("Failed to update shift", err);
        }
      });

    } else {
      console.log("updating3");

      this.shiftService.addShift(newShift);
    }
    console.log("updating4");
  }


  closeEditShift() {
    console.log("closeEditShift");
    this.closeShiftEdit.emit();

  }

  // Gruppiere Zuweisungen nach Rollen und cache das Ergebnis
  updateGroupedAssignments(): void {
    const grouped: { [roleId: number]: Assignment[] } = {};

    // Gruppiere alle Zuweisungen nach Rolle
    this.assignments.forEach(a => {
      if (!grouped[a.role]) {
        grouped[a.role] = [];
      }
      grouped[a.role].push(a);
    });

    // Konvertiere in Array mit zusätzlichen Informationen
    this.groupedAssignments = Object.keys(grouped).map(roleIdStr => {
      const roleId = Number(roleIdStr);
      return {
        roleId: roleId,
        roleName: this.getRoleName(roleId),
        assignments: grouped[roleId],
        count: grouped[roleId].length
      };
    });
  }

  getRoleName(roleId: number): string {
    return this.roleNameMap[roleId] || 'Unbekannte Rolle';
  }

  getConfirmationStatus(confirmed: boolean | null): string {
    if (confirmed === true) return 'bestätigt';
    if (confirmed === false) return 'abgelehnt';
    return 'ausstehend';
  }

  // Entferne eine spezifische Zuweisung
  removeAssignment(assignmentId: number) {
    this.somethingChanged = true;
    this.assignments = this.assignments.filter(a => a.id !== assignmentId);
    this.updateGroupedAssignments();
  }

  // Entferne alle Zuweisungen einer Rolle
  removeRole(roleId: number) {
    this.somethingChanged = true;
    this.assignments = this.assignments.filter(a => a.role !== roleId);
    this.updateAvailableRoles();
    this.updateGroupedAssignments();
  }

  // Füge eine leere Zuweisung für eine Rolle hinzu
  addAssignmentToRole(roleId: number) {
    this.somethingChanged = true;
    const newAssignment: Assignment = {
      id: -1 * (Date.now()), // Temporäre negative ID für neue Zuweisungen
      employee: 0, // 0 bedeutet "offen"
      shift: this.shiftId,
      role: roleId,
      confirmed: null as any
    };
    this.assignments.push(newAssignment);
    this.updateGroupedAssignments();
  }

  // Ändere den Mitarbeiter für eine Zuweisung
  // Aktualisiere die Liste der verfügbaren Rollen (die noch nicht zugewiesen sind)
  updateAvailableRoles() {
    const usedRoleIds = new Set(this.assignments.map(a => a.role));
    this.availableRoles = this.roles.filter(r => !usedRoleIds.has(r.id));
  }

  // Füge eine neue Rolle zur Schicht hinzu
  addNewRole() {
    if (this.selectedNewRoleId && this.selectedNewRoleId !== -1) {
      this.somethingChanged = true;
      this.addAssignmentToRole(this.selectedNewRoleId);
      this.updateAvailableRoles();
      this.selectedNewRoleId = -1;
    }
  }

  // Cache Mitarbeiter nach Rolle
  updateEmployeesByRole(): void {
    this.employeesByRole = {};
    if (this.roles && this.employees) {
      this.roles.forEach(role => {
        this.employeesByRole[role.id] = this.employees.filter(emp =>
          emp.roles.some(r => r.roleId === role.id && r.hasRole)
        );
      });
    }
  }

  // Filtere Mitarbeiter, die die entsprechende Rolle haben
  getEmployeesForRole(roleId: number): Employee[] {
    return this.employeesByRole[roleId] || [];
  }
}
