import {Component, ElementRef, HostListener, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {KeycloakService} from 'keycloak-angular';
import {KeycloakOperationService} from '../../services/keycloak-service/keycloak.service';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {Employee} from '../../interfaces/employee';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-menu',
  imports: [
    RouterLink,
    RouterLinkActive
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
  isInternalAdmin: boolean = false;
  userInitials: string = "";

  constructor(private eRef: ElementRef) {}

  async ngOnInit(): Promise<void> {
    const isLoggedIn = await this.keycloakService.isLoggedIn();
    if (!isLoggedIn) {
      return;
    }

    const roles = this.keycloakOperationService.getUserRoles();
    this.isManager = roles.includes('user-is-manager');
    this.isInternalAdmin = roles.includes('user-is-internal-admin');

    if (this.isInternalAdmin) {
      this.userInitials = 'IA';
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

  getIsManager(): boolean {
    return this.isManager;
  }

  isInternalAdminUser(): boolean {
    return this.isInternalAdmin;
  }

  isEmployee(): boolean {
    const roles = this.keycloakOperationService.getUserRoles();
    return !roles.includes('user-is-manager') && !roles.includes('user-is-internal-admin');
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

  protected readonly close = close;
}
