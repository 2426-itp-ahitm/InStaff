import {Component, OnInit} from '@angular/core';
import {Employee} from '../employee';
import {EmployeeServiceService} from '../employee-service.service';
import {NgForOf, NgIf} from '@angular/common';
import {EmployeeEditComponent} from '../employee-edit/employee-edit.component';
import {AddEmployeeComponent} from '../add-employee/add-employee.component';


@Component({
  selector: 'app-employee-list',
  imports: [
    NgForOf,
    NgIf,
    EmployeeEditComponent,
    AddEmployeeComponent
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  isAddMode: boolean = false;

  constructor(private employeeService: EmployeeServiceService) {}

  ngOnInit(): void {
    this.employeeService.employees$.subscribe((data) => {
      this.employees = data;
      this.selectedEmployee = this.employees[0];
    });
    this.employeeService.getEmployees();
  }

  openEmpEdit(employee: Employee) {
    this.selectedEmployee = employee;

  }

  openAddEmployee() {
    this.isAddMode = true;
  }

  closeAddEmployee() {
    this.isAddMode = false;
  }
}
