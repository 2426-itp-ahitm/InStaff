import {Component, inject} from '@angular/core';
import {KeycloakService} from 'keycloak-angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-landing-page',
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  keycloakService: KeycloakService = inject(KeycloakService);
  router: Router = inject(Router);

  async login(): Promise<void> {
    await this.keycloakService.login({
      redirectUri: window.location.origin + '/dashboard'
    });
  }

  async goToDashboard(): Promise<void> {
    const isLoggedIn = await this.keycloakService.isLoggedIn();

    if(isLoggedIn) {
      await this.router.navigate(['/dashboard'])
      return
    }

    await this.login()
  }
}
