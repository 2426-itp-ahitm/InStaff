import {Component, inject, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { Employee } from "../../interfaces/employee";
import {EmployeeServiceService} from '../employee-service/employee-service.service';
import {NgOptimizedImage} from '@angular/common';
import {DateService} from '../../services/date-service/date.service';

@Component({
  selector: 'app-employee-card',
  imports: [
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
  dateService: DateService = inject(DateService);

  ngOnInit() {
  }



  openEmpEdit() {
    this.editEmployee.emit(this.employee);
  }
}
