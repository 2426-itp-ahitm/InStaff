import {Component, inject, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { Employee } from "../../interfaces/employee";
import {EmployeeServiceService} from '../employee-service/employee-service.service';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-employee-card',
  imports: [
    NgForOf,
    NgIf,
    NgOptimizedImage
  ],
  templateUrl: './employee-card.component.html',
  styleUrl: './employee-card.component.css'
})
export class EmployeeCardComponent implements OnInit {
  employeeService:EmployeeServiceService = inject(EmployeeServiceService);
  @Input() employee!: Employee;
  @Output() editEmployee: EventEmitter<Employee> = new EventEmitter<Employee>();
  employeeHasRoles: Boolean = false;

  ngOnInit() {

    this.checkIfEmployeeHasRoles()
  }

  checkIfEmployeeHasRoles() {
    for (let r of this.employee.roles) {
      if (r.hasRole) {
        this.employeeHasRoles = true;
        return;
      }
    }
    this.employeeHasRoles = false;
  }

  openEmpEdit() {
    this.editEmployee.emit(this.employee);
  }
}
