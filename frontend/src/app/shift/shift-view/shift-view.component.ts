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
import {AssignmentServiceService} from '../../services/assignment-service/assignment-service.service';
import {ShiftTemplateServiceService} from '../../shift-template/shift-template-service/shift-template-service.service';
import {Employee} from '../../interfaces/employee';
import {Assignment} from '../../interfaces/assignment';
import {ShiftCreate} from '../../interfaces/shift-create';
import {Shifttemplate} from '../../interfaces/shifttemplate';

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
  assignmentService: AssignmentServiceService = inject(AssignmentServiceService);
  shiftTemplateService: ShiftTemplateServiceService = inject(ShiftTemplateServiceService);

  roleNameMap: { [id: number]: string } = {};
  employees: Employee[] = [];
  assignments: Assignment[] = [];
  groupedAssignments: { roleId: number; roleName: string; assignments: Assignment[] }[] = [];

  ngOnInit(): void {
    this.employeeService.getAllEmployees();

    this.shiftService.getShiftById(this.shiftId).subscribe((s: Shift) => {
      console.log(s);
      this.shift = s
      console.log(this.shift);
    })

    this.assignmentService.getAssignmentByShiftId(this.shiftId).subscribe((a: Assignment[]) => {
      this.assignments = a;
      this.buildGroupedAssignments();
    })

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

  //TODO
  private buildGroupedAssignments(): void {
    /*
    const groups = new Map<number, Assignment[]>();

    for (const assignment of this.assignments) {
      if (!groups.has(assignment.role)) {
        groups.set(assignment.role, []);
      }
      groups.get(assignment.role)!.push(assignment);
    }

    this.groupedAssignments = Array.from(groups.entries())
      .map(([roleId, roleAssignments]) => ({
        roleId,
        roleName: this.roleNameMap[roleId] ?? `Rolle ${roleId}`,
        assignments: [...roleAssignments].sort((a, b) => {
          const aEmployee = this.employeeService.getEmployeeById(a.employee);
          const bEmployee = this.employeeService.getEmployeeById(b.employee);
          const aName = `${aEmployee.firstName} ${aEmployee.lastname}`.trim();
          const bName = `${bEmployee.firstname} ${bEmployee.lastname}`.trim();
          return aName.localeCompare(bName, 'de');
        })
      }))
      .sort((a, b) => a.roleName.localeCompare(b.roleName, 'de'));

     */
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
}
