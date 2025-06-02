import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
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

@Component({
  selector: 'app-add-shift',
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './add-shift.component.html',
  styleUrl: './add-shift.component.css'
})
export class AddShiftComponent implements OnInit {
  selectedDate!: NewShift;
  shiftTemplates: ShiftTemplate[] = [];
  selectedShiftTemplate: ShiftTemplate | null = null;

  @ViewChild('shiftTemplateInput') shiftTemplateInput!: ElementRef;
  private selectedEmployees:  { [roleId: number]: number[] } = {};


  constructor(private employeeService:EmployeeServiceService,private shiftService:ShiftServiceService, protected roleService:RoleServiceService) {}

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
    this.shiftService.getShiftTemplates();
    this.shiftService.shiftTemplates$.subscribe((data) => {
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

  save() {
    const assignments: NewAssignment[] = [];

    for (const roleIdStr in this.selectedEmployees) {
      const roleId = +roleIdStr;
      const employeeIds = this.selectedEmployees[roleId];
      for (const empId of employeeIds) {
        if (empId != null) {
          assignments.push({
            employee: empId,
            role: roleId,
          });
        }
      }
    }

    console.log('Generated Assignments:', assignments);
    // TODO: this.assignmentService.addAssignments(assignments); or similar
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
