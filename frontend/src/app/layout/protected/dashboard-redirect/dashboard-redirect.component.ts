import { Component, inject, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { KeycloakService } from 'keycloak-angular'
import is = jasmine.is;

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
    const isEmployee = !isManager;

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
