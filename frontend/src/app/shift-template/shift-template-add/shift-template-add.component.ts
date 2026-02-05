import {Component, ElementRef, EventEmitter, inject, Output, ViewChild, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {RoleServiceService} from '../../role/role-service/role-service.service';
import {FeedbackServiceService} from '../../feedback/feedback-service/feedback-service.service';
import {ShiftTemplateServiceService} from '../shift-template-service/shift-template-service.service';
import {ShiftTemplate, TemplateRole} from '../../interfaces/shift-template';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {Role} from '../../interfaces/role';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {Employee} from '../../interfaces/employee';

@Component({
  selector: 'app-shift-template-add',
  imports: [
  FormsModule,
  NgForOf
  ],
  templateUrl: './shift-template-add.component.html',
  styleUrl: './shift-template-add.component.css'
})
export class ShiftTemplateAddComponent implements OnInit {
  shiftTemplateService: ShiftTemplateServiceService = inject(ShiftTemplateServiceService)
  companyService: CompanyServiceService = inject(CompanyServiceService)

  @ViewChild('shiftTemplateNameInput') shiftTemplateNameInput!: ElementRef;

  @Output() close = new EventEmitter<void>();
  // state for roles / employees UI
  roleService: RoleServiceService = inject(RoleServiceService);
  employeeService: EmployeeServiceService = inject(EmployeeServiceService);

  roles: Role[] = [];

  // entries the user added while building the template
  addedRoles: { roleId: number; count: number; selectedEmployees: (number | null)[] }[] = [];

  ngOnInit(): void {
    // load roles and employees for the dropdowns
    this.roleService.getRoles();
    this.roleService.roles$.subscribe((r) => {
      this.roles = r;
    });

    
  }

  getRoleName(roleId: number): string {
    const r = this.roles.find(rr => rr.id === roleId);
    return r ? r.roleName : '';
  }

  // returns roles that haven't been added yet
  availableRoles(): Role[] {
    return this.roles.filter(r => !this.addedRoles.some(ar => ar.roleId === r.id));
  }

  save(): void {
    const newShiftTemplateName: string = this.shiftTemplateNameInput.nativeElement.value;

    const templateRoles: TemplateRole[] = this.addedRoles.map(ar => ({ roleId: ar.roleId, count: ar.count }));

    const newShiftTemplate: ShiftTemplate = {
      id: -1,
      shiftTemplateName: newShiftTemplateName,
      companyId: this.companyService.getCompanyId(),
      templateRoles: templateRoles
    };

    this.shiftTemplateService.addShiftTemplate(newShiftTemplate);

    this.closeAddRole();
  }

  closeAddRole(): void {
    this.close.emit();
  }

  // UI methods
  addRole(roleIdStr: string, countStr: string) {
    const roleId = Number(roleIdStr);
    const count = Math.max(1, Number(countStr) || 1);
    if (!roleId || !this.roles.find(r => r.id === roleId)) return;

    // initialize selectedEmployees with nulls
    const selectedEmployees = Array(count).fill(null);
    this.addedRoles.push({ roleId, count, selectedEmployees });
  }

  removeAddedRole(index: number) {
    this.addedRoles.splice(index, 1);
  }


}
