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
import {Shift} from '../../interfaces/shift';
import {FormsModule} from "@angular/forms";
import {NgClass} from "@angular/common";
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {ShiftServiceService} from '../shift-service/shift-service.service';
import {Employee} from '../../interfaces/employee';
import {RoleServiceService} from '../../role/role-service/role-service.service';
import {AssignmentServiceService} from '../../services/assignment-service/assignment-service.service';
import {Assignment} from '../../interfaces/assignment';
import {Role} from '../../interfaces/role';
import {DateService} from '../../services/date-service/date.service';
import {AssignmentCreate} from '../../interfaces/assignment-create';
import {ShiftCreate} from '../../interfaces/shift-create';
import {ShiftCreateAssignments} from '../../interfaces/shift-create-assignments';
import {EmployeeShort} from '../../interfaces/employee-short';

@Component({
  selector: 'app-shift-edit',
  imports: [
    FormsModule,
    NgClass
  ],
  templateUrl: './shift-edit.component.html',
  styleUrl: './shift-edit.component.css'
})
export class ShiftEditComponent implements OnInit {

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

  companyService:CompanyServiceService = inject(CompanyServiceService);
  employeeService:EmployeeServiceService = inject(EmployeeServiceService);
  shiftService:ShiftServiceService = inject(ShiftServiceService);
  roleService:RoleServiceService = inject(RoleServiceService);
  assignmentService:AssignmentServiceService = inject(AssignmentServiceService);
  dateService: DateService = inject(DateService);

  shift!:Shift;
  shiftStartTime!: Date;
  shiftEndTime!: Date;
  groupedAssignments: {role: Role, assignments:Assignment[]}[] = [];
  employeesByRole: {roleId: number, employees: Employee[]}[] = [];


  roleNameMap: { [id: number]: string } = {};
  somethingChanged: boolean = false;


  ngOnInit(): void {
    this.shiftService.getShiftById(this.shiftId).subscribe(s => {
      this.shift = s
      this.shiftStartTime = s.startTime
      this.shiftEndTime = s.endTime;
      console.log(this.shift)

      const groups = new Map<number, { role: Role; assignments: Assignment[] }>();

      (this.shift.assignments ?? []).forEach((assignment) => {
        if (!assignment.employee?.id) {
          assignment.employee = { id: 0 } as EmployeeShort;
        }

        const roleId = assignment.role.id;
        const existingGroup = groups.get(roleId);

        if (existingGroup) {
          existingGroup.assignments.push(assignment);
          return;
        }

        groups.set(roleId, {
          role: assignment.role,
          assignments: [assignment]
        });
      });

      this.groupedAssignments = Array.from(groups.values());
      this.employeesByRole = [];
      this.groupedAssignments.forEach(gA => {
        this.employeeService.getAllEmployeesByRoleId(gA.role.id).subscribe(es => {
          this.employeesByRole.push({roleId: gA.role.id, employees: es});
          this.normalizeRoleAssignments(gA.role.id, es);
          console.log(this.employeesByRole)
        })
      })

    })


  }





  somethingChangedSetTrue(){
    this.somethingChanged = true
  }

  getRoleName(roleId: number): string {
    return this.roleNameMap[roleId] || 'Unbekannte Rolle';
  }

  getConfirmationStatus(confirmed: boolean | null): string {
    if (confirmed === true) return 'bestätigt';
    if (confirmed === false) return 'abgelehnt';
    return 'ausstehend';
  }

  closeEditShift() {
    console.log("closeEditShift");
    this.closeShiftEdit.emit();

  }

  removeRole(id: number) {

  }

  getEmployeesForRole(roleId: any):Employee[] {
    return this.employeesByRole.find((entry) => entry.roleId === roleId)?.employees ?? []
  }

  getAssignmentEmployeeId(assignment: Assignment): number {
    const employeeId = assignment.employee?.id;
    if (!employeeId) {
      return 0;
    }

    const roleEmployees = this.getEmployeesForRole(assignment.role.id);
    if (roleEmployees.length === 0) {
      return 0;
    }

    return roleEmployees.some((employee) => employee.id === employeeId) ? employeeId : 0;
  }

  setAssignmentEmployeeId(assignment: Assignment, employeeId: number): void {
    if (employeeId === 0) {
      assignment.employee = { id: 0 } as EmployeeShort;
      return;
    }

    const roleEmployees = this.getEmployeesForRole(assignment.role.id);
    const selectedEmployee = roleEmployees.find((employee) => employee.id === employeeId);
    if (selectedEmployee) {
      assignment.employee = selectedEmployee as unknown as EmployeeShort;
    }
  }

  private normalizeRoleAssignments(roleId: number, roleEmployees: Employee[]): void {
    const validEmployeeIds = new Set(roleEmployees.map((employee) => employee.id));
    const targetGroup = this.groupedAssignments.find((group) => group.role.id === roleId);
    if (!targetGroup) {
      return;
    }

    targetGroup.assignments.forEach((assignment) => {
      const currentEmployeeId = assignment.employee?.id ?? 0;
      if (!currentEmployeeId || !validEmployeeIds.has(currentEmployeeId)) {
        assignment.employee = { id: 0 } as EmployeeShort;
      }
    });
  }

  protected removeAssignment(id: number) {

  }

  protected addAssignmentToRole(group: {role: Role, assignments:Assignment[]}): void {
    const newAssignment: Assignment = {
      id: -Date.now(),
      confirmed: null,
      seen: false,
      employee: { id: 0 } as EmployeeShort,
      shift: {
        id: this.shift.id,
        shiftName: this.shift.shiftName,
        startTime: this.shift.startTime,
        endTime: this.shift.endTime
      },
      role: group.role
    };

    group.assignments.push(newAssignment);
    this.shift.assignments = [...(this.shift.assignments ?? []), newAssignment];
    this.somethingChanged = true;

  }


  //TODO
  protected save() {


  }

  protected deleteShift() {

  }


}
