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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';
import {Shift} from '../../interfaces/shift';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {ShiftServiceService} from '../shift-service/shift-service.service';
import {RoleServiceService} from '../../role/role-service/role-service.service';
import {ShiftTemplateServiceService} from '../../shift-template/shift-template-service/shift-template-service.service';
import {Employee} from '../../interfaces/employee';
import {Assignment} from '../../interfaces/assignment';
import {ShiftCreate} from '../../interfaces/shift-create';
import {Shifttemplate} from '../../interfaces/shifttemplate';
import {AssignmentStatus} from '../../interfaces/AssignmentStatus';

@Component({
  selector: 'app-shift-view',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './shift-view.component.html',
  styleUrl: './shift-view.component.css'
})
export class ShiftViewComponent implements OnInit {
  @Output() closeShiftView = new EventEmitter<unknown>();

  @Input() shiftId!: number;

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {

    }else if (event.key === 'Escape') {
      this.closeViewShift()
    }
  }

  shift!: Shift;
  selectedDate!: ShiftCreate;
  shiftTemplates: Shifttemplate[] = [];
  selectedShiftTemplate: Shifttemplate | null = null;


  @ViewChild('shiftTemplateInput') shiftTemplateInput!: ElementRef;
  private selectedEmployees: { [roleId: number]: number[] } = {};

  companyService: CompanyServiceService = inject(CompanyServiceService);
  employeeService: EmployeeServiceService = inject(EmployeeServiceService);
  shiftService: ShiftServiceService = inject(ShiftServiceService);
  roleService: RoleServiceService = inject(RoleServiceService);
  shiftTemplateService: ShiftTemplateServiceService = inject(ShiftTemplateServiceService);

  roleNameMap: { [id: number]: string } = {};
  employees: Employee[] = [];
  assignments: Assignment[] = [];
  groupedAssignments: { roleId: number; roleName: string; assignments: Assignment[] }[] = [];

  ngOnInit(): void {
    this.employeeService.getAllEmployees();

    this.shiftService.getShiftById(this.shiftId).subscribe((s: Shift) => {
      this.shift = s
      this.assignments = s.assignments ?? [];
      this.buildGroupedAssignments();
    });

    //get all Employees
    this.employeeService.getAllEmployees()
    this.employeeService.employees$.subscribe((e) => {
      this.employees = e;
      this.buildGroupedAssignments();
    })

    //gets all Templates
    this.shiftTemplateService.getShiftTemplates();
    this.shiftTemplateService.shiftTemplates$.subscribe((data) => {
      this.shiftTemplates = data;
      this.selectedShiftTemplate = this.shiftTemplates[0];
    })

    //gets all Roles
    this.roleService.getRoles()
    this.roleService.roles$.subscribe((roles) => {
      this.roleNameMap = roles.reduce((map, role) => {
        map[role.id] = role.roleName;
        return map;
      }, {} as { [id: number]: string });
      this.buildGroupedAssignments();
    });


  }

  closeViewShift() {
    this.closeShiftView.emit();

  }

  private buildGroupedAssignments(): void {
    const groups = new Map<number, { roleName: string; assignments: Assignment[] }>();

    this.assignments.forEach((assignment) => {
      const roleId = assignment.role?.id;
      if (!roleId) {
        return;
      }

      const current = groups.get(roleId);
      if (current) {
        current.assignments.push(assignment);
        return;
      }

      groups.set(roleId, {
        roleName: assignment.role.roleName || this.roleNameMap[roleId] || `Rolle ${roleId}`,
        assignments: [assignment]
      });
    });

    this.groupedAssignments = Array.from(groups.entries())
      .map(([roleId, roleGroup]) => ({
        roleId,
        roleName: roleGroup.roleName,
        assignments: roleGroup.assignments
      }))
      .sort((a, b) => a.roleName.localeCompare(b.roleName, 'de'));
  }

  makeStringFromBoolean(confirmed: boolean | null) {
    if (confirmed) {
      return "Bestätigt";
    } else if (confirmed == null) {
      return "Ausstehend";
    } else {
      return "Abgelehnt";
    }
  }

  protected readonly AssignmentStatus = AssignmentStatus;
}
