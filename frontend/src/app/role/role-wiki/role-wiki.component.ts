import { Component } from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {RoleServiceService} from '../role-service/role-service.service';
import {Role} from '../../interfaces/role';

@Component({
  selector: 'app-role-wiki',
  imports: [
    NgForOf,
    NgIf,
    NgOptimizedImage
  ],
  templateUrl: './role-wiki.component.html',
  styleUrl: './role-wiki.component.css'
})
export class RoleWikiComponent {
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
}

