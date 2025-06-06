import {Component, ElementRef, EventEmitter, inject, OnInit, Output, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {DateClickArg} from '@fullcalendar/interaction';
import {ShiftServiceService} from '../shift-service/shift-service.service';
import {ShiftTemplate} from '../interfaces/shift-template';
import {NewShift} from '../interfaces/shift';
import {RoleServiceService} from '../role-service/role-service.service';
import {Assignment} from '../interfaces/assignment';
import {NewAssignment} from '../interfaces/new-assignment';
import {Employee} from '../interfaces/employee';
import {EmployeeServiceService} from '../employee-service/employee-service.service';
import {ShiftTemplateServiceService} from '../shift-template-service/shift-template-service.service';
import {CompanyServiceService} from '../company-service/company-service.service';

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
  selectedDate!: NewShift;
  shiftTemplates: ShiftTemplate[] = [];
  selectedShiftTemplate: ShiftTemplate | null = null;


  @ViewChild('shiftTemplateInput') shiftTemplateInput!: ElementRef;
  private selectedEmployees:  { [roleId: number]: number[] } = {};

  companyService:CompanyServiceService = inject(CompanyServiceService);
  employeeService:EmployeeServiceService = inject(EmployeeServiceService);
  shiftService:ShiftServiceService = inject(ShiftServiceService);
  roleService:RoleServiceService = inject(RoleServiceService);
  shiftTemplateService: ShiftTemplateServiceService = inject(ShiftTemplateServiceService);

  roleNameMap: { [id: number]: string } = {};
  employees: Employee[] = [];

  ngOnInit(): void {
    this.selectedDate = this.shiftService.selectedDate

    //get all Employees
    this.employeeService.getEmployees()
    this.employeeService.employees$.subscribe((e) => {
      this.employees = e;
    })

    //gets all Templates
    this.shiftTemplateService.getShiftTemplates();
    this.shiftTemplateService.shiftTemplates$.subscribe((data) => {
      this.shiftTemplates = data;
      console.log(this.shiftTemplates);
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
    console.log(this.roleNameMap);

  }

  @Output() close = new EventEmitter<void>();

  initializeSelectedEmployees(roleId: number, count: number): boolean {
    if (!this.selectedEmployees[roleId]) {
      this.selectedEmployees[roleId] = Array(count).fill(null);
    }
    return true;
  }



  collectAssignments(): NewAssignment[] {
    const assignments: NewAssignment[] = [];

    for (const roleIdStr in this.selectedEmployees) {
      const roleId = +roleIdStr;
      const employeeIds = this.selectedEmployees[roleId];

      for (const empId of employeeIds) {
        if (empId != null) {
          assignments.push({
            role: roleId,
            employee: empId
          });
        }
      }
    }

    return assignments;
  }

  save() {
    const newShift: NewShift = {
      shiftCreateDTO: {
        startTime: this.selectedDate.startTime.toString(),
        endTime: this.selectedDate.endTime.toString(),
        companyId: this.companyService.getCompanyId()
      },
      assignmentCreateDTOs: this.collectAssignments(),
    };

    // logic to save newShift
  }

  closeAddShift() {
    this.close.emit();
  }

  chooseShiftTemplate() {
    let shiftTemplateId:number = this.shiftTemplateInput.nativeElement.value;
    for (let i = 0; i < this.shiftTemplates.length; i++) {
      if(shiftTemplateId == this.shiftTemplates[i].id){
        this.selectedShiftTemplate = this.shiftTemplates[i];
      }
    }
    console.log(this.selectedShiftTemplate);
  }

  protected readonly RoleServiceService = RoleServiceService;
}
