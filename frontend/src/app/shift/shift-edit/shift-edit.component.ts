import {Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Shift} from '../../interfaces/shift';
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {NewShift, ShiftCreateDTO} from '../../interfaces/new-shift';
import {ShiftTemplate} from '../../interfaces/shift-template';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {ShiftServiceService} from '../shift-service/shift-service.service';
import {ShiftTemplateServiceService} from '../../shift-template/shift-template-service/shift-template-service.service';
import {Employee} from '../../interfaces/employee';
import {NewAssignment} from '../../interfaces/new-assignment';
import {RoleServiceService} from '../../role/role-service/role-service.service';
import {AssignmentServiceService} from '../../services/assignment-service/assignment-service.service';
import {Assignment} from '../../interfaces/assignment';

@Component({
  selector: 'app-shift-edit',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './shift-edit.component.html',
  styleUrl: './shift-edit.component.css'
})
export class ShiftEditComponent implements OnInit {
  @Output() closeShiftEdit = new EventEmitter<unknown>();

  @Input() shiftId!: number;

  shift!: Shift;
  selectedDate!: ShiftCreateDTO;
  shiftTemplates: ShiftTemplate[] = [];
  selectedShiftTemplate: ShiftTemplate | null = null;


  @ViewChild('shiftTemplateInput') shiftTemplateInput!: ElementRef;
  private selectedEmployees:  { [roleId: number]: number[] } = {};

  companyService:CompanyServiceService = inject(CompanyServiceService);
  employeeService:EmployeeServiceService = inject(EmployeeServiceService);
  shiftService:ShiftServiceService = inject(ShiftServiceService);
  roleService:RoleServiceService = inject(RoleServiceService);
  assignmentService:AssignmentServiceService = inject(AssignmentServiceService);
  shiftTemplateService: ShiftTemplateServiceService = inject(ShiftTemplateServiceService);

  roleNameMap: { [id: number]: string } = {};
  employees: Employee[] = [];
  assignments: Assignment[] = [];

  ngOnInit(): void {
    this.employeeService.getEmployees();

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
    });



  }


  initializeSelectedEmployees(roleId: number, count: number): boolean {
    if (!this.selectedEmployees[roleId]) {
      this.selectedEmployees[roleId] = Array(count).fill(null);
    }
    return true;
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
    } {}

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

    // logic to save newShift
    this.shiftService.addShift(newShift)
    this.closeEditShift()

  }



  chooseShiftTemplate() {
    let shiftTemplateId:number = this.shiftTemplateInput.nativeElement.value;
    for (let i = 0; i < this.shiftTemplates.length; i++) {
      if(shiftTemplateId == this.shiftTemplates[i].id){
        this.selectedShiftTemplate = this.shiftTemplates[i];
      }
    }
  }

  closeEditShift() {
    this.closeShiftEdit.emit();

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
