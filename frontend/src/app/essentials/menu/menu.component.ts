import {Component, ElementRef, HostListener, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgClass, NgIf} from '@angular/common';
import {KeycloakService} from 'keycloak-angular';
import {KeycloakOperationService} from '../../services/keycloak-service/keycloak.service';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {Employee} from '../../interfaces/employee';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-menu',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass,
    NgIf
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('100ms ease-in', style({ opacity: 0 }))
      ])
    ])
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
  userInitials: string = "";

  constructor(private eRef: ElementRef) {}

  async ngOnInit(): Promise<void> {
    const isLoggedIn = await this.keycloakService.isLoggedIn();
    if (!isLoggedIn) {
      return;
    }

    const keycloakId = this.keycloakService.getKeycloakInstance().subject;
    if (!keycloakId) {
      return;
    }

    this.employeeService.getEmployeeByKeykloackId(keycloakId).subscribe((emp) => {
      this.employee = emp;
      this.isManager = emp.isManager;
      this.userInitials = this.employee.firstname[0].toUpperCase() + this.employee.lastname[0].toUpperCase();
    });
  }

  isAdmin(): boolean {
    //return true;
    return this.keycloakOperationService.getUserRoles().includes('user-is-manager');
  }

  isEmployee(): boolean {
    const roles = this.keycloakOperationService.getUserRoles();
    return !roles.includes('user-is-manager');
  }

  logout() {
    this.keycloakService.logout();
  }

  closeMenu(): void {
    this.isMenuOpen ? this.isMenuOpen = false : true;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }
}
