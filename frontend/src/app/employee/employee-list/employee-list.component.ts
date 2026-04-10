import {Component, inject, OnInit} from '@angular/core';
import {Employee} from '../../interfaces/employee';
import {EmployeeServiceService} from '../employee-service/employee-service.service';
import {NgOptimizedImage} from '@angular/common';
import {EmployeeEditComponent} from '../employee-edit/employee-edit.component';
import {EmployeeAddComponent} from '../employee-add/employee-add.component';
import {EmployeeCardComponent} from '../employee-card/employee-card.component';
import {KeycloakService} from 'keycloak-angular';
import {RoleServiceService} from '../../role/role-service/role-service.service';


@Component({
  selector: 'app-employee-list',
  imports: [
    EmployeeEditComponent,
    EmployeeAddComponent,
    EmployeeCardComponent,
    NgOptimizedImage,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  searchTerm: string = '';
  selectedEmployee: Employee = this.employees[0];
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  keycloakService: KeycloakService = inject(KeycloakService);
  roleService: RoleServiceService = inject(RoleServiceService)

  constructor(private employeeService: EmployeeServiceService) {}

  ngOnInit(): void {
    this.employeeService.employees$.subscribe((data) => {
      this.employees = data;
      console.log(this.employees);

    });
    this.employeeService.getAllEmployees();
  }

  onSearch(term: string) {
    this.searchTerm = term || '';
  }

  get filteredEmployees(): Employee[] {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) return this.employees;
    return this.employees.filter(e => (`${e.firstname} ${e.lastname}`).toLowerCase().includes(q));
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
    this.roleService.getRoles()
    this.employeeService.getAllEmployees()
  }
}
