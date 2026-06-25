import { Component, inject, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { KeycloakService } from 'keycloak-angular'

@Component({
  selector: 'app-dashboard-redirect',
  standalone: true,
  template: `<p>Dashboard wird geladen...</p>`
})
export class DashboardRedirectComponent implements OnInit {
  private router = inject(Router)
  private keycloakService = inject(KeycloakService)

  async ngOnInit(): Promise<void> {
    const isManager = this.keycloakService.isUserInRole('user-is-manager')
    const isAdmin = this.keycloakService.isUserInRole('user-is-internal-admin')
    const isEmployee = !isManager && !isAdmin;

    if (isAdmin) {
      await this.router.navigate(['/admin-home'])
      return
    }

    if (isManager) {
      await this.router.navigate(['/home'])
      return
    }

    if (isEmployee) {
      await this.router.navigate(['/emp-home'])
      return
    }


    await this.router.navigate(['/'])
  }
}
