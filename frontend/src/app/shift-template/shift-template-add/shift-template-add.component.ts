import {Component, ElementRef, EventEmitter, inject, Output, ViewChild, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RoleServiceService} from '../../role/role-service/role-service.service';
import {ShiftTemplateServiceService} from '../shift-template-service/shift-template-service.service';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {Role} from '../../interfaces/role';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {Templaterole} from '../../interfaces/templaterole';
import {TemplateroleCreate} from '../../interfaces/templaterole-create';
import {ShifttemplateCreate} from '../../interfaces/shifttemplate-create';

@Component({
  selector: 'app-shift-template-add',
  imports: [
  FormsModule
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
    const newRoles: TemplateroleCreate[] = this.addedRoles.map(tr => ({
      roleId: tr.roleId,
      count: Math.max(1, tr.count)
    }));

    const newShiftTemplate: ShifttemplateCreate = {
      shiftTemplateName: this.shiftTemplateNameInput.nativeElement.value,
      templateRoles: newRoles
    };

    this.shiftTemplateService.addShiftTemplate(newShiftTemplate);

    this.closeAddRole();
  }

  closeAddRole(): void {
    this.close.emit();
  }

  // UI methods
  addRole(roleIdStr: string) {
    const roleId = Number(roleIdStr);
    if (!roleId || !this.roles.find(r => r.id === roleId)) return;

    const count = 1;
    // initialize selectedEmployees with nulls
    const selectedEmployees = Array(count).fill(null);
    this.addedRoles.push({ roleId, count, selectedEmployees });
  }

  removeAddedRole(index: number) {
    this.addedRoles.splice(index, 1);
  }




}
