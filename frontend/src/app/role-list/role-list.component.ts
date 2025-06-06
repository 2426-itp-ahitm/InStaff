import {Component, OnInit} from '@angular/core';
import {AddRoleComponent} from '../add-role/add-role.component';
import {RoleServiceService} from '../role-service/role-service.service';
import {Role} from '../interfaces/role';
import {NgForOf, NgIf} from '@angular/common';
import {RoleEditComponent} from '../role-edit/role-edit.component';

@Component({
  selector: 'app-role-list',
  imports: [
    AddRoleComponent,
    NgForOf,
    NgIf,
    RoleEditComponent
  ],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css'
})
export class RoleListComponent implements OnInit{
  constructor(private roleService: RoleServiceService) {}

  roles: Role[] = []
  selectedRole: Role = this.roles[0];
  isAddMode: boolean = false;
  isEditMode: boolean = false;

  //als Erstes auf roles$ subscriben und dann getRole() ausführen (pusht die neuen roles in roles$ und dann bekommen wirs)
  ngOnInit(): void {
    this.roleService.roles$.subscribe((data) => {
      this.roles = data;
    });
    this.roleService.getRoles();
  }

  openRoleEdit(role: Role) {
    this.isEditMode = true;
    this.selectedRole = role;
  }
  closeRoleEdit() {
    this.isEditMode = false;
  }


  openAddRole() {
    this.isAddMode = true;
  }
  closeAddRole() {
    this.isAddMode = false;
  }
}
