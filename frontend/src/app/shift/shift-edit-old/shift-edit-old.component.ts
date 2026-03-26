import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Shift} from '../../interfaces/shift';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {ShiftServiceService} from '../shift-service/shift-service.service';
import {RoleServiceService} from '../../role/role-service/role-service.service';
import {AssignmentServiceService} from '../../services/assignment-service/assignment-service.service';
import {Employee} from '../../interfaces/employee';
import {Assignment} from '../../interfaces/assignment';
import {AssignmentCreate} from '../../interfaces/assignment-create';
import {ShiftCreateAssignments} from '../../interfaces/shift-create-assignments';
import {DateService} from '../../services/date-service/date.service';
import {Role} from '../../interfaces/role';

@Component({
  selector: 'app-shift-edit-old',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './shift-edit-old.component.html',
  styleUrl: './shift-edit-old.component.css'
})
export class ShiftEditOldComponent implements OnInit {
  @Output() closeShiftEdit = new EventEmitter<unknown>();

  @Input() shiftId!: number;
  @ViewChild('shiftNameInput') shiftNameInput!: ElementRef;

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {

    }else if (event.key === 'Escape') {
      this.closeEditShift()
    }
  }

  roles!: Role[];
  shift!: Shift;

  companyService:CompanyServiceService = inject(CompanyServiceService);
  employeeService:EmployeeServiceService = inject(EmployeeServiceService);
  shiftService:ShiftServiceService = inject(ShiftServiceService);
  roleService:RoleServiceService = inject(RoleServiceService);
  assignmentService:AssignmentServiceService = inject(AssignmentServiceService);
  dateService: DateService = inject(DateService);


  roleNameMap: { [id: number]: string } = {};
  employees: Employee[] = [];
  assignments: Assignment[] = [];
  newAssignments: AssignmentCreate[] = [];
  availableRoles: Role[] = [];
  selectedNewRoleId: number = -1;
  groupedAssignments: { roleId: number, roleName: string, assignments: Assignment[], count: number }[] = [];
  employeesByRole: { [roleId: number]: Employee[] } = {};
  somethingChanged: boolean = false;

  shiftStartTime!: Date;
  shiftEndTime!: Date;

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
      this.shift = s
      console.log(s)
      this.shiftStartTime = s.startTime
      this.shiftEndTime = s.endTime

      console.log(this.shiftStartTime);
      console.log(this.shiftEndTime);
    })
    //TODO

    this.assignmentService.getAssignmentByShiftId(this.shiftId).subscribe((a: Assignment[]) => {
      this.assignments = a;
      this.assignmentsLoaded = true;
      this.updateGroupedIfReady();
    })


    //get all Employees
    this.employeeService.getAllEmployees()
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
    // TODO
    // Filtere nur gültige Zuweisungen (mit zugewiesenem Mitarbeiter)
    /*
    const validAssignments: AssignmentCreate[] = this.assignments
      .filter(a => a.employee.id !== 0) // Nur Zuweisungen mit zugewiesenem Mitarbeiter
      .map(a => ({
        employee: a.employee,
        role: a.role
     }));

     */
    //TODO
    let validAssignments: AssignmentCreate[] = [];
    const newShift: ShiftCreateAssignments = {
      shiftCreateDTO: {
        shiftName: this.shiftNameInput.nativeElement.value,
        startTime: this.shiftStartTime,
        endTime: this.shiftEndTime,
      },
      assignmentCreateDTOs: validAssignments,
    };
    console.log("***********+")
    console.log(newShift);
    //TODO
    // If editing an existing shift, call update; otherwise fallback to add
    /*
    if (this.shift && this.shift.id) {
      this.shiftService.updateShift(this.shift.id, newShift).subscribe({
        next: () => {
          this.closeEditShift();
        },
        error: (err) => {
          console.error("Failed to update shift", err);
        }
      });
    } else {
      this.shiftService.addShift(newShift);
    }

     */
  }


  closeEditShift() {
    console.log("closeEditShift");
    this.closeShiftEdit.emit();

  }

  // Gruppiere Zuweisungen nach Rollen und cache das Ergebnis
  updateGroupedAssignments(): void {
    const grouped: { [roleId: number]: Assignment[] } = {};

    //TODO
    // Gruppiere alle Zuweisungen nach Rolle
    this.assignments.forEach(a => {
      if (!grouped[a.role.id]) {
        grouped[a.role.id] = [];
      }
      grouped[a.role.id].push(a);
    });
    // TODO
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
  // TODO
  // Entferne eine spezifische Zuweisung
  removeAssignment(assignmentId: number) {
    /*
    this.somethingChanged = true;
    this.assignments = this.assignments.filter(a => a.id !== assignmentId);

     */
    this.updateGroupedAssignments();
    this.updateAvailableRoles();
  }

  // Entferne alle Zuweisungen einer Rolle
  removeRole(roleId: number) {
    console.log("removeRole", roleId);
    this.somethingChanged = true;
    this.assignments = this.assignments.filter(a => a.role.id != roleId);
    this.newAssignments = this.newAssignments.filter(a => a.roleId != roleId);
    this.updateGroupedAssignments();
    this.updateAvailableRoles();
  }

  // Füge eine leere Zuweisung für eine Rolle hinzu
  addAssignmentToRole(roleId: number) {
    this.somethingChanged = true;
    const newAssignment: AssignmentCreate = {
      employeeId: null, // 0 bedeutet "offen"
      shiftId: this.shiftId,
      roleId: roleId,
    };
    this.newAssignments.push(newAssignment);
    this.updateGroupedAssignments();
    this.updateAvailableRoles();
  }

  // Ändere den Mitarbeiter für eine Zuweisung
  // Aktualisiere die Liste der verfügbaren Rollen (die noch nicht zugewiesen sind)
  updateAvailableRoles() {
    const displayedRoleIds = new Set(this.groupedAssignments.map(group => group.roleId));
    this.availableRoles = this.roles.filter(role => !displayedRoleIds.has(role.id));
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
          //TODO
          emp.roles.some(r => r.id === role.id && true)
        );
      });
    }
  }

  // Filtere Mitarbeiter, die die entsprechende Rolle haben
  getEmployeesForRole(roleId: number): Employee[] {
    return this.employeesByRole[roleId] || [];
  }


  deleteShift(){
    if (confirm(`Sicher, dass du die ${this.shift.shiftName} am ${this.dateService.dateStringToString(this.shift.startTime.toString(), true, true, "von")} bis ${this.dateService.dateStringToString(this.shift.endTime.toString(), true, false, "")} löschen willst?`)) {
      this.shiftService.deleteShift(this.shiftId).subscribe({
        next: () => {
          this.shiftService.getShifts()
          this.closeEditShift();
        }
      })
    }
  }

  private toDateTimeLocalValue(dateString: string): string {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hour}:${minute}`;
  }

  private toBackendDateTimeString(dateTimeLocal: string): string {
    return dateTimeLocal.length === 16 ? `${dateTimeLocal}:00` : dateTimeLocal;
  }


}
