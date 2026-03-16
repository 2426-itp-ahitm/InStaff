import { Component, inject, OnInit } from '@angular/core';
import {KeycloakService} from 'keycloak-angular';

@Component({
  selector: 'app-login',
  template: `<p>Weiterleitung zum Login...</p>`
})
export class LoginComponent implements OnInit {
  keycloakService: KeycloakService = inject(KeycloakService);

  async ngOnInit() {
    await this.keycloakService.login({
      redirectUri: window.location.origin + '/dashboard'
    });
  }
}
