import {Component, ElementRef, EventEmitter, HostListener, inject, OnInit, Output, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ShiftServiceService} from '../shift-service/shift-service.service';
import {RoleServiceService} from '../../role/role-service/role-service.service';
import {Role} from '../../interfaces/role';
import {Assignment} from '../../interfaces/assignment';
import {Employee} from '../../interfaces/employee';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {ShiftTemplateServiceService} from '../../shift-template/shift-template-service/shift-template-service.service';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {AssignmentServiceService} from '../../services/assignment-service/assignment-service.service';
import {FeedbackServiceService} from '../../feedback/feedback-service/feedback-service.service';
import {ShiftCreate} from '../../interfaces/shift-create';
import {Shifttemplate} from '../../interfaces/shifttemplate';
import {AssignmentCreate} from '../../interfaces/assignment-create';

import {ShiftCreateAssignments} from '../../interfaces/shift-create-assignments';

@Component({
  selector: 'app-shift-add',
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './shift-add.component.html',
  styleUrl: './shift-add.component.css'
})
export class ShiftAddComponent implements OnInit {
  selectedDate!: ShiftCreate;
  shiftTemplates: Shifttemplate[] = [];
  selectedShiftTemplate: Shifttemplate | null = null;
  assignments: Assignment[] = [];
  step: number = 0; // 0: date/time, 1: template choose, 2: assign employees
  startTime!: string;
  endTime!: string;
  shiftName: string = '';
  dateError: string | null = null;


  @ViewChild('shiftTemplateInput') shiftTemplateInput!: ElementRef;

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {

    }else if (event.key === 'Escape') {
      this.closeAddShift()
    }
  }


  private selectedEmployees:  { [roleId: number]: (number | null)[] } = {};
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
    this.startTime = this.toDateTimeLocalValue(new Date(this.selectedDate.startTime));
    this.endTime = this.toDateTimeLocalValue(new Date(this.selectedDate.endTime));



    //get all Employees
    this.employeeService.getAllEmployees()
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

  onEmployeeSelect(roleId: number, idx: number, value: string | number) {
    const v = Number(value);
    if (!this.selectedEmployees[roleId]) {
      this.selectedEmployees[roleId] = [];
    }
    this.selectedEmployees[roleId][idx] = isNaN(v) || v < 0 ? null : v;
  }

  getSelectedEmployeeId(roleId: number, idx: number): number {
    const value = this.selectedEmployees[roleId]?.[idx];
    return typeof value === 'number' && value > 0 ? value : -1;
  }

  addManualRole(roleIdStr: string, countStr: string) {
    const roleId = Number(roleIdStr);
    const count = Math.max(1, Number(countStr) || 1);
    if (!roleId || !this.roles.find(r => r.id === roleId)) return;
    this.manualRoles.push({ roleId, count });
  }

  getCurrentRoles(): { roleId: number; count: number }[] {
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
      this.selectedDate.startTime = new Date(this.startTime);
      this.selectedDate.endTime = new Date(this.endTime);
    }
    if(this.step === 1) {
      this.chooseShiftTemplate()
    }
    if (this.step < 2) {
      this.step++;
    }
    // when entering assignment step, initialize selects
    if (this.step === 2) {
      if (!this.shiftName?.trim()) {
        this.shiftName = this.selectedShiftTemplate?.shiftTemplateName ?? '';
      }
      const roles = this.getCurrentRoles();
      roles.forEach((r: { roleId: number; count: number; }) => {
        this.initializeSelectedEmployees(r.roleId, r.count);
      });
    }
  }

  isDateValid(): boolean {
    if (!this.startTime || !this.endTime) return false;
    const s = new Date(this.startTime);
    const e = new Date(this.endTime);
    return e.getTime() > s.getTime();
  }

  private applyDefaultShiftHoursIfCalendarPassedAllDaySlot(): void {
    const start = new Date(this.startTime);
    const end = new Date(this.endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return;
    }

    const isStartMidnight = start.getHours() === 0 && start.getMinutes() === 0;
    const isEndMidnight = end.getHours() === 0 && end.getMinutes() === 0;
    const isExactlyOneDay = end.getTime() - start.getTime() === 24 * 60 * 60 * 1000;

    if (!isStartMidnight || !isEndMidnight || !isExactlyOneDay) {
      return;
    }

    const defaultStart = new Date(start);
    defaultStart.setHours(12, 0, 0, 0);

    const defaultEnd = new Date(start);
    defaultEnd.setHours(21, 0, 0, 0);

    this.startTime = this.toDateTimeLocalValue(defaultStart);
    this.endTime = this.toDateTimeLocalValue(defaultEnd);
  }

  private toDateTimeLocalValue(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  back() {
    if (this.step > 0) this.step--;
  }



  collectAssignments(): AssignmentCreate[] {
    const assignments: AssignmentCreate[] = [];
    const roles = this.getCurrentRoles();
    for (let i = 0; i < roles.length; i++) {
      let roleId = roles[i].roleId;
      const count = roles[i].count;
      const sel = this.selectedEmployees[roleId] || [];
      for (let j = 0; j < count; j++) {
        const value = sel[j] ?? null;
        // Backend expects a non-null employeeId; skip open slots.
        if (value !== null) {
          assignments.push({ employeeId: value, roleId: roleId });
        }
      }
    }
    return assignments;
  }

  save() {
    const normalizedShiftName = (this.shiftName ?? '').trim();
    const assignments: AssignmentCreate[] = this.collectAssignments();
    const newShift: ShiftCreate = {
      shiftName: normalizedShiftName.length > 0
        ? normalizedShiftName
        : (this.selectedShiftTemplate?.shiftTemplateName ?? 'Schicht'),
        startTime: new Date(this.startTime),
        endTime: new Date(this.endTime),
    };
    const shiftWithAssignments: ShiftCreateAssignments ={
      shiftCreateDTO: newShift,
      assignmentCreateDTOS: assignments
    }
    this.shiftService.addShift(shiftWithAssignments).subscribe({
      next: () => {
        this.closeAddShift();
      },
      error: () => {
      }
    });
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

    this.manualRoles = this.selectedShiftTemplate
      ? this.selectedShiftTemplate.templateRoles.map((r) => ({ roleId: r.role.id, count: r.count }))
      : [];

    if (!this.shiftName?.trim()) {
      this.shiftName = this.selectedShiftTemplate?.shiftTemplateName ?? '';
    }
    // reset selectedEmployees when template changes
    this.selectedEmployees = {};
  }

  protected readonly RoleServiceService = RoleServiceService;


  checkIfEmpHasRole(emp: Employee, roleId: number): boolean {
    return emp.roles.some(role => role.id === roleId);
  }

  protected readonly Date = Date;
}
