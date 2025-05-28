import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Role} from '../interface/role';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {RoleServiceService} from '../role-service.service';
import {Employee} from '../interface/employee';
import {EmployeeServiceService} from '../employee-service.service';

@Component({
  selector: 'app-role-edit',
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './role-edit.component.html',
  styleUrl: './role-edit.component.css'
})
export class RoleEditComponent implements OnInit {
  constructor(private roleService: RoleServiceService, private employeeService: EmployeeServiceService) { }

  employeesWithRole: Employee[] = [];

  ngOnInit(): void {
    if (this.role.employees.length > 0) {
      for (let i = 0; i < this.role.employees.length; i++) {
        this.employeeService.getEnrichedEmployeeById(this.role.employees.at(i)!).subscribe(e => {
          this.employeesWithRole.push(e);
        });
      }
    }

  }

  @Input() role!: Role;

  @ViewChild('roleNameInput') roleNameInput!: ElementRef;

  @Output() closeRoleEdit = new EventEmitter<unknown>();

  save(): void {
    const updatedRole: Role = {
      ...this.role,
      roleName: this.roleNameInput.nativeElement.value
    };
    this.roleService.updateRole(updatedRole);
    console.log('Saving employee:', updatedRole);
    this.close();
  }

  close(): void {
    this.closeRoleEdit.emit();
  }

  deleteRole(role: Role) {

  }
}
