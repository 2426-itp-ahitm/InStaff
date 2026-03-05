import {Component, ElementRef, EventEmitter, inject, OnInit, Output, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {DateClickArg} from '@fullcalendar/interaction';
import {ShiftServiceService} from '../shift-service/shift-service.service';
import {ShiftTemplate, TemplateRole} from '../../interfaces/shift-template';
import {RoleServiceService} from '../../role/role-service/role-service.service';
import {Role} from '../../interfaces/role';
import {Assignment} from '../../interfaces/assignment';
import {NewAssignment} from '../../interfaces/new-assignment';
import {Employee} from '../../interfaces/employee';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {ShiftTemplateServiceService} from '../../shift-template/shift-template-service/shift-template-service.service';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {NewShift, ShiftCreateDTO} from '../../interfaces/new-shift';
import {AssignmentServiceService} from '../../services/assignment-service/assignment-service.service';
import { Feedback } from '../../interfaces/feedback';
import {FeedbackServiceService} from '../../feedback/feedback-service/feedback-service.service';

@Component({
  selector: 'app-shift-add',
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './shift-add.component.html',
  styleUrl: './shift-add.component.css'
})
export class ShiftAddComponent implements OnInit {
  selectedDate!: ShiftCreateDTO;
  shiftTemplates: ShiftTemplate[] = [];
  selectedShiftTemplate: ShiftTemplate | null = null;
  assignments: Assignment[] = [];
  step: number = 0; // 0: date/time, 1: template choose, 2: assign employees
  startTime!: string;
  endTime!: string;
  dateError: string | null = null;


  @ViewChild('shiftTemplateInput') shiftTemplateInput!: ElementRef;
  private selectedEmployees:  { [roleId: number]: number[] } = {};
  // for manual roles when skipping template
  manualRoles: { roleId: number; count: number }[] = [];
  selectedNewRoleId: number = -1;

  companyService:CompanyServiceService = inject(CompanyServiceService);
  employeeService:EmployeeServiceService = inject(EmployeeServiceService);
  shiftService:ShiftServiceService = inject(ShiftServiceService);
  roleService:RoleServiceService = inject(RoleServiceService);
  shiftTemplateService: ShiftTemplateServiceService = inject(ShiftTemplateServiceService);
  assignmentService: AssignmentServiceService = inject(AssignmentServiceService);
  feedbackService: FeedbackServiceService = inject(FeedbackServiceService);

  roleNameMap: { [id: number]: string } = {};
  employees: Employee[] = []; 
  roles: Role[] = [];

  ngOnInit(): void {
    this.selectedDate = this.shiftService.selectedDate

    // initialize editable times with selectedDate values
    this.startTime = this.selectedDate.startTime;
    this.endTime = this.selectedDate.endTime;



    //get all Employees
    this.employeeService.getEmployees()
    this.employeeService.employees$.subscribe((e) => {
      this.employees = e;
    })

    //gets all Templates
    this.shiftTemplateService.getShiftTemplates();
    this.shiftTemplateService.shiftTemplates$.subscribe((data) => {
      this.shiftTemplates = data;
      // don't auto-select here; user chooses in step 2
    })

    //gets all Roles
    this.roleService.getRoles()
    this.roleService.roles$.subscribe((roles) => {
      this.roles = roles;
      this.roleNameMap = roles.reduce((map, role) => {
        map[role.id] = role.roleName;
        return map;
      }, {} as { [id: number]: string });
    });

  }

  @Output() close = new EventEmitter<void>();

  initializeSelectedEmployees(roleId: number, count: number): boolean {
    if (!this.selectedEmployees[roleId] || this.selectedEmployees[roleId].length !== count) {
      this.selectedEmployees[roleId] = Array(count).fill(null);
    }
    return true;
  }

  onEmployeeSelect(roleId: number, idx: number, value: string) {
    const v = Number(value);
    if (!this.selectedEmployees[roleId]) {
      this.selectedEmployees[roleId] = [];
    }
    this.selectedEmployees[roleId][idx] = isNaN(v) ? null as any : v;
  }

  addManualRole(roleIdStr: string, countStr: string) {
    const roleId = Number(roleIdStr);
    const count = Math.max(1, Number(countStr) || 1);
    if (!roleId || !this.roles.find(r => r.id === roleId)) return;
    this.manualRoles.push({ roleId, count });
  }

  private getCurrentRoles(): { roleId: number; count: number }[] {
    if (this.selectedShiftTemplate) {
      return this.selectedShiftTemplate.templateRoles;
    }
    return this.manualRoles;
  }

  addNewRole() {
    if (this.selectedNewRoleId === -1) return;

    const roleId = Number(this.selectedNewRoleId);
    const roleList = this.getCurrentRoles();
    const existingRole = roleList.find(r => r.roleId === roleId);

    if (existingRole) {
      existingRole.count += 1;
    } else {
      roleList.push({ roleId, count: 1 });
    }

    this.initializeSelectedEmployees(roleId, (roleList.find(r => r.roleId === roleId)?.count ?? 1));
    this.selectedNewRoleId = -1;
  }

  removeRole(roleId: number) {
    const roleList = this.getCurrentRoles();
    const index = roleList.findIndex(r => r.roleId === roleId);
    if (index === -1) return;

    roleList.splice(index, 1);
    delete this.selectedEmployees[roleId];
  }

  addAssignmentToRole(roleId: number) {
    const roleList = this.getCurrentRoles();
    const roleEntry = roleList.find(r => r.roleId === roleId);
    if (!roleEntry) return;

    roleEntry.count += 1;
    const current = this.selectedEmployees[roleId] ?? [];
    current.push(null as any);
    this.selectedEmployees[roleId] = current;
  }

  removeAssignment(roleId: number, assignmentIndex: number) {
    const roleList = this.getCurrentRoles();
    const roleEntry = roleList.find(r => r.roleId === roleId);
    if (!roleEntry) return;

    const current = this.selectedEmployees[roleId] ?? [];
    if (assignmentIndex >= 0 && assignmentIndex < current.length) {
      current.splice(assignmentIndex, 1);
      this.selectedEmployees[roleId] = current;
    }

    roleEntry.count -= 1;
    if (roleEntry.count <= 0) {
      this.removeRole(roleId);
    }
  }

  // wizard navigation
  next() {
    if (this.step === 0) {
      // validate date/time
      if (!this.isDateValid()) {
        this.feedbackService.newFeedback({message:"Endzeit muss nach der Startzeit liegen.", type: 'error', showFeedback: true})
        this.dateError = 'Endzeit muss nach der Startzeit liegen.';
        return;
      }
      this.dateError = null;
      // save edited times into selectedDate
      this.selectedDate.startTime = this.startTime;
      this.selectedDate.endTime = this.endTime;
    }
    if(this.step === 1) {
      this.chooseShiftTemplate()
    }
    if (this.step < 2) {
      this.step++;
    }
    // when entering assignment step, initialize selects
    if (this.step === 2) {
      const roles = this.selectedShiftTemplate ? this.selectedShiftTemplate.templateRoles : this.manualRoles;
      roles.forEach(r => this.initializeSelectedEmployees(r.roleId, r.count));
    }
  }

  isDateValid(): boolean {
    if (!this.startTime || !this.endTime) return false;
    const s = new Date(this.startTime);
    const e = new Date(this.endTime);
    return e.getTime() > s.getTime();
  }

  back() {
    if (this.step > 0) this.step--;
  }



  collectAssignments(): NewAssignment[] {
    const assignments: NewAssignment[] = [];
    const roles = this.selectedShiftTemplate ? this.selectedShiftTemplate.templateRoles : this.manualRoles;
    for (let i = 0; i < roles.length; i++) {
      const roleId = roles[i].roleId;
      const count = roles[i].count;
      const sel = this.selectedEmployees[roleId] || [];
      for (let j = 0; j < count; j++) {
        const value = sel[j] ?? null;
        assignments.push({ employee: value ?? -1, role: roleId });
      }
    }

    return assignments;
  }

  save() {
    let assignments: NewAssignment[] = this.collectAssignments();
    const newShift: NewShift = {
      shiftCreateDTO: {
        startTime: this.selectedDate.startTime,
        endTime: this.selectedDate.endTime,
        companyId: this.selectedDate.companyId,
      },
      assignmentCreateDTOs: assignments,
    };

    this.shiftService.addShift(newShift);
    this.closeAddShift();

  }

  closeAddShift() {
    this.close.emit();
  }

  chooseShiftTemplate() {
    let shiftTemplateId:number = Number(this.shiftTemplateInput.nativeElement.value);
    const selectedTemplate = this.shiftTemplates.find(t => t.id === shiftTemplateId) ?? null;
    this.selectedShiftTemplate = selectedTemplate
      ? {
          ...selectedTemplate,
          templateRoles: selectedTemplate.templateRoles.map(r => ({ ...r }))
        }
      : null;
    // reset selectedEmployees when template changes
    this.selectedEmployees = {};
  }

  protected readonly RoleServiceService = RoleServiceService;


  checkIfEmpHasRole(emp: Employee, tmpRole: TemplateRole): boolean {
    return emp.roles.some(role => role.roleId === tmpRole.roleId && role.hasRole);
  }

  protected readonly Date = Date;
}
