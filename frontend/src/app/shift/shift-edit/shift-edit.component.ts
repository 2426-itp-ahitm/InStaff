import {Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild, AfterViewInit} from '@angular/core';
import {Shift} from '../../interfaces/shift';
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {NewShift, ShiftCreateDTO} from '../../interfaces/new-shift';
import {ShiftTemplate, TemplateRole} from '../../interfaces/shift-template';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {ShiftServiceService} from '../shift-service/shift-service.service';
import {ShiftTemplateServiceService} from '../../shift-template/shift-template-service/shift-template-service.service';
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
    NgIf
  ],
  templateUrl: './shift-edit.component.html',
  styleUrl: './shift-edit.component.css'
})
export class ShiftEditComponent implements OnInit {
  @Output() closeShiftEdit = new EventEmitter<unknown>();

  @Input() shiftId!: number;
  roles!: Role[];
  shift!: Shift;
  selectedDate!: ShiftCreateDTO;
  shiftTemplates: ShiftTemplate[] = [];
  selectedShiftTemplate: ShiftTemplate | null = null;


  private selectedEmployees:  { [roleId: number]: number[] } = {};

  companyService:CompanyServiceService = inject(CompanyServiceService);
  employeeService:EmployeeServiceService = inject(EmployeeServiceService);
  shiftService:ShiftServiceService = inject(ShiftServiceService);
  roleService:RoleServiceService = inject(RoleServiceService);
  assignmentService:AssignmentServiceService = inject(AssignmentServiceService);

  roleNameMap: { [id: number]: string } = {};
  employees: Employee[] = [];
  assignments: Assignment[] = [];

  ngOnInit(): void {

    this.shiftService.getShiftById(this.shiftId).subscribe((s: Shift) => {
      console.log(s);
      this.shift = s
      console.log(this.shift);
    })

    this.assignmentService.getAssignmentByShiftId(this.shiftId).subscribe((a: Assignment[]) => {
      this.assignments = a;
    })


    //get all Employees
    this.employeeService.getEmployees()
    this.employeeService.employees$.subscribe((e) => {
      this.employees = e;
    })

    //gets all Roles
    this.roleService.getRoles()
    this.roleService.roles$.subscribe((roles) => {
      this.roleNameMap = roles.reduce((map, role) => {
        map[role.id] = role.roleName;
        return map;
      }, {} as { [id: number]: string });
    });



  }




  collectAssignments(): NewAssignment[] {
    const assignments: NewAssignment[] = [];
    const tmpRoles = this.selectedShiftTemplate!.templateRoles
    for (let i = 0; i < tmpRoles.length; i++) {
      for (let j = 0; j < tmpRoles.at(i)!.count; j++) {
        const dropdownId = `employee-select-${tmpRoles[i].roleId}-${j}`;
        const dropdown = document.getElementById(dropdownId) as HTMLSelectElement | null;
        if (dropdown) {
          const value = Number(dropdown.value);
          assignments.push({employee: value, role: tmpRoles.at(i)!.roleId})
        }
      }
    }

    // Prefer using selectedEmployees state if available
    if (this.selectedShiftTemplate && Object.keys(this.selectedEmployees).length > 0) {
      const result: NewAssignment[] = [];
      const roles = this.selectedShiftTemplate.templateRoles;
      for (let r of roles) {
        const arr = this.selectedEmployees[r.roleId] || [];
        for (let k = 0; k < r.count; k++) {
          const emp = arr[k];
          if (emp != null && emp !== 0) {
            result.push({employee: emp, role: r.roleId});
          }
        }
      }
      return result;
    }

    return assignments;
  }

  save() {

    const newShift: NewShift = {
      shiftCreateDTO: {
        startTime: this.selectedDate.startTime,
        endTime: this.selectedDate.endTime,
        companyId: this.selectedDate.companyId,
      },
      assignmentCreateDTOs: this.collectAssignments(),
    };

    // If editing an existing shift, call update; otherwise fallback to add
    if (this.shift && this.shift.id) {
      this.shiftService.updateShift(this.shift.id, newShift);
    } else {
      this.shiftService.addShift(newShift);
    }
    this.closeEditShift()

  }





  private mapAssignmentsToSelectedEmployees() {
    if (!this.assignments || this.assignments.length === 0) return;

    const map: { [roleId: number]: number[] } = {};
    for (const a of this.assignments) {
      if (!map[a.role]) map[a.role] = [];
      map[a.role].push(a.employee);
    }

    // ensure arrays align with template counts when template exists
    if (this.selectedShiftTemplate) {
      for (const tr of this.selectedShiftTemplate.templateRoles) {
        if (!map[tr.roleId]) map[tr.roleId] = Array(tr.count).fill(null);
        if (map[tr.roleId].length < tr.count) {
          map[tr.roleId] = [...map[tr.roleId], ...Array(tr.count - map[tr.roleId].length).fill(null)];
        } else if (map[tr.roleId].length > tr.count) {
          map[tr.roleId] = map[tr.roleId].slice(0, tr.count);
        }
      }
    }

    this.selectedEmployees = map;
  }

  closeEditShift() {
    this.closeShiftEdit.emit();

  }

  checkIfEmpHasRole(emp: Employee, tmpRole: TemplateRole): boolean {
    return emp.roles.some(role => role.roleId === tmpRole.roleId && role.hasRole);
  }

  onEmployeeSelect(roleId: number, idx: number, value: string) {
    const v = Number(value);
    if (!this.selectedEmployees[roleId]) {
      this.selectedEmployees[roleId] = [];
    }
    this.selectedEmployees[roleId][idx] = isNaN(v) ? null as any : v;
  }

  makeStringFromBoolean(confirmed: boolean) {
    if (confirmed) {
      return "Bestätigt";
    }else if(confirmed==null) {
      return "Ausstehend";
    } else{
      return "Abgelehnt";
    }

  }
}
