import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router'
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular'

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

    // User not logged in → trigger Keycloak login
    if (!this.authenticated) {
      await this.keycloakService.login({
        redirectUri: window.location.origin + state.url
      })
      return false
    }

    const requiredRoles = route.data['rolesAllowed'] as string[] | undefined

    // If route has no role restriction → any logged in user allowed
    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }

    const hasRequiredRole = requiredRoles.some(role =>
      this.keycloakService.isUserInRole(role)
    )

    // Manager role required but user is employee
    if (!hasRequiredRole) {
      this.router.navigate(['/emp-home'])
      return false
    }

    return true
  }
}
