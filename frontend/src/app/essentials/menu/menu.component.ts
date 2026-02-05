import {Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgClass, NgIf} from '@angular/common';
import {KeycloakService} from 'keycloak-angular';

@Component({
  selector: 'app-menu',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  keycloakService: KeycloakService = inject(KeycloakService);
  isMenuOpen: boolean=false

  logout() {
    this.keycloakService.logout();
  }
}
