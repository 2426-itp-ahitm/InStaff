import {Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Role} from '../../interfaces/role';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {ShiftTemplate} from '../../interfaces/shift-template';
import {ShiftTemplateServiceService} from '../shift-template-service/shift-template-service.service';
import {FeedbackServiceService} from '../../feedback/feedback-service/feedback-service.service';
import {RoleServiceService} from '../../role/role-service/role-service.service';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {Employee} from '../../interfaces/employee';

@Component({
  selector: 'app-shift-template-edit',
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './shift-template-edit.component.html',
  styleUrl: './shift-template-edit.component.css'
})
export class ShiftTemplateEditComponent implements OnInit {

  shiftTemplateService: ShiftTemplateServiceService = inject(ShiftTemplateServiceService);
  feedbackService: FeedbackServiceService = inject(FeedbackServiceService)
  roleService: RoleServiceService = inject(RoleServiceService)



  @Input() shiftTemplate!: ShiftTemplate;
  @Output() closeShiftTemplateEdit = new EventEmitter<unknown>();

  @ViewChild('shiftTemplateNameInput') shiftTemplateNameInput!: ElementRef;

  // UI state like in add component
  employeeService: EmployeeServiceService = inject(EmployeeServiceService);
  roles: Role[] = [];
  employees: Employee[] = [];

  addedRoles: { roleId: number; count: number; selectedEmployees: (number | null)[] }[] = [];

  ngOnInit(): void {
    this.roleService.getRoles();
    this.roleService.roles$.subscribe(r => this.roles = r);

    // load employees for the dropdowns (optional but useful)
    this.employeeService.getEmployees();
    this.employeeService.employees$.subscribe(e => this.employees = e);

    // initialize addedRoles from the provided shiftTemplate
    if (this.shiftTemplate && this.shiftTemplate.templateRoles) {
      this.addedRoles = this.shiftTemplate.templateRoles.map(tr => ({ roleId: tr.roleId, count: tr.count, selectedEmployees: Array(tr.count).fill(null) }));
    }
  }

  save(): void {
    const templateRoles = this.addedRoles.map(ar => ({ roleId: ar.roleId, count: ar.count }));
    const updatedShiftTemplate: ShiftTemplate = {
      ...this.shiftTemplate,
      shiftTemplateName: this.shiftTemplateNameInput.nativeElement.value,
      templateRoles: templateRoles
    };
    this.shiftTemplateService.updateShiftTemplate(updatedShiftTemplate);
    this.close();

  }

  close(): void {
    this.closeShiftTemplateEdit.emit();
  }



  deleteShiftTemplate(shiftTemplateToDelte: ShiftTemplate) {
    const confirmed = confirm(`Are you sure you want to delete the role ${ shiftTemplateToDelte.shiftTemplateName }?`);
    if (!confirmed) {
      return;
    }
    this.shiftTemplateService.deleteShiftTemplate(shiftTemplateToDelte.id);
    this.feedbackService.newFeedback({message:"Shift Template successfully deleted", type: 'error', showFeedback: true})

    this.close();
  }

  getRoleName(roleId: number): string {
    const r = this.roles.find(rr => rr.id === roleId);
    return r ? r.roleName : '';
  }

  availableRoles(): Role[] {
    return this.roles.filter(r => !this.addedRoles.some(ar => ar.roleId === r.id));
  }

  addRole(roleIdStr: string) {
    const roleId = Number(roleIdStr);
    if (!roleId || !this.roles.find(r => r.id === roleId)) return;
    const count = 1; // Default to 1
    const selectedEmployees = Array(count).fill(null);
    this.addedRoles.push({ roleId, count, selectedEmployees });
  }

  removeAddedRole(index: number) {
    this.addedRoles.splice(index, 1);
  }

  employeesWithRole(roleId: number) {
    return this.employees.filter(emp => emp.roles?.some(r => r.roleId === roleId && r.hasRole));
  }
}
