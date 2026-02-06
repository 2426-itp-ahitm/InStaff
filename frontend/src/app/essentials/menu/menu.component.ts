import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgClass, NgIf} from '@angular/common';
import {KeycloakService} from 'keycloak-angular';
import {KeycloakOperationService} from '../../services/keycloak-service/keycloak.service';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {Employee} from '../../interfaces/employee';

@Component({
  selector: 'app-menu',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass,
    NgIf
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  keycloakService: KeycloakService = inject(KeycloakService);
  keycloakOperationService: KeycloakOperationService = inject(KeycloakOperationService);
  employeeService: EmployeeServiceService = inject(EmployeeServiceService);
  isMenuOpen: boolean=false
  employee?: Employee;
  isManager: boolean = false;

  async ngOnInit(): Promise<void> {
    const isLoggedIn = await this.keycloakService.isLoggedIn();
    if (!isLoggedIn) {
      return;
    }

    const keycloakId = this.keycloakService.getKeycloakInstance().subject;
    if (!keycloakId) {
      return;
    }

    this.employeeService.getEmployeeByKeycloakId(keycloakId).subscribe((emp) => {
      this.employee = emp;
      this.isManager = !!emp.isManager;
    });
  }

  isAdmin(): boolean {
    return true;
    //return this.isManager || this.keycloakOperationService.getUserRoles().includes('manager');
  }

  isEmployee(): boolean {
    const roles = this.keycloakOperationService.getUserRoles();
    return roles.includes('employee') || roles.includes('manager');
  }

  logout() {
    this.keycloakService.logout();
  }
}
