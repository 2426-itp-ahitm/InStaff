import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {NewEmployee} from '../interfaces/new-employee';
import {EmployeeServiceService} from '../employee-service/employee-service.service';
import {RoleServiceService} from '../role-service/role-service.service';

@Component({
  selector: 'app-add-role',
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './add-role.component.html',
  styleUrl: './add-role.component.css'
})
export class AddRoleComponent {
  constructor(private roleService: RoleServiceService) {}

  @ViewChild('roleNameInput') roleNameInput!: ElementRef;

  @Output() close = new EventEmitter<void>();

  save(): void {
    const newRoleName:string = this.roleNameInput.nativeElement.value;

    this.roleService.addRole(newRoleName);
    console.log('new role:', newRoleName);
    this.closeAddRole()
  }

  closeAddRole(): void {
    this.close.emit();
  }
}
