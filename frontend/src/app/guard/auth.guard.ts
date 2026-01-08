import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {KeycloakAuthGuard, KeycloakService} from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override readonly router: Router,
    protected readonly keycloakService: KeycloakService
  ) {
    super(router, keycloakService)
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (!this.authenticated) {
      await this.keycloakService.login({
        redirectUri: window.location.origin + state.url,
      });
      return false;
    }

    const requiredRoles = route.data['roles'] as string[];

    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return true;
    }

    const hasRole = requiredRoles.some(role => this.keycloakService.isUserInRole(role));
    if (!hasRole) {
      this.router.navigate(['/not-authorized']);
      return false;
    }

    return true;
  }

  override async canActivate(): Promise<boolean> {
    const isLoggedIn = await this.keycloakService.isLoggedIn();
    if (!isLoggedIn) {
      await this.keycloakService.login();
      return false;
    }
    return true;
  }
}
