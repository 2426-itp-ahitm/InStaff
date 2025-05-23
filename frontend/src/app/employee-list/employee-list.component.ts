import {Component, OnInit} from '@angular/core';
import {Employee} from '../employee';
import {EmployeeServiceService} from '../employee-service.service';
import {NgForOf, NgIf} from '@angular/common';
import {EmployeeEditComponent} from '../employee-edit/employee-edit.component';


@Component({
  selector: 'app-employee-list',
  imports: [
    NgForOf,
    NgIf,
    EmployeeEditComponent
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;


  constructor(private employeeService: EmployeeServiceService) {}

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe((data) => {
      this.employees = data;
      this.selectedEmployee = this.employees[0];
    });
  }

  openEmpEdit(employee: Employee) {
    this.selectedEmployee = employee;

  }
}
