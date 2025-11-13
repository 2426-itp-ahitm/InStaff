import {Component, OnInit} from '@angular/core';
import {Employee} from '../../interfaces/employee';
import {EmployeeServiceService} from '../employee-service/employee-service.service';
import {NgForOf, NgIf} from '@angular/common';
import {EmployeeEditComponent} from '../employee-edit/employee-edit.component';
import {EmployeeAddComponent} from '../employee-add/employee-add.component';
import {CardComponent} from '../../essentials/card/card.component';
import {EmployeeCardComponent} from '../employee-card/employee-card.component';


@Component({
  selector: 'app-employee-list',
  imports: [
    NgForOf,
    NgIf,
    EmployeeEditComponent,
    EmployeeAddComponent,
    CardComponent,
    EmployeeCardComponent,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  selectedEmployee: Employee = this.employees[0];
  isAddMode: boolean = false;
  isEditMode: boolean = false;

  constructor(private employeeService: EmployeeServiceService) {}

  ngOnInit(): void {
    this.employeeService.employees$.subscribe((data) => {
      this.employees = data;
    });
    this.employeeService.getEmployees();
  }

  openEmpEdit(employee: Employee) {
    this.isEditMode = true;
    this.selectedEmployee = employee;
  }
  closeEmpEdit() {
    this.isEditMode = false;
  }

  openAddEmployee() {
    this.isAddMode = true;
  }

  closeAddEmployee() {
    this.isAddMode = false;
    this.employeeService.getEmployees()
  }
}
