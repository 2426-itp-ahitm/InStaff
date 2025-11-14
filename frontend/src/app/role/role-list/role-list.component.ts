import {Component, OnInit} from '@angular/core';
import {RoleServiceService} from '../role-service/role-service.service';
import {Role} from '../../interfaces/role';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {RoleEditComponent} from '../role-edit/role-edit.component';
import {RoleAddComponent} from '../role-add/role-add.component';

@Component({
  selector: 'app-role-list',
  imports: [
    NgForOf,
    NgIf,
    RoleEditComponent,
    RoleAddComponent,
    NgOptimizedImage
  ],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.css'
})
export class RoleListComponent implements OnInit{
  constructor(private roleService: RoleServiceService) {}

  roles: Role[] = []
  searchTerm: string = '';
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

  onSearch(term: string) {
    this.searchTerm = term || '';
  }

  get filteredRoles(): Role[] {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) return this.roles;
    return this.roles.filter(r => r.roleName.toLowerCase().includes(q));
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
