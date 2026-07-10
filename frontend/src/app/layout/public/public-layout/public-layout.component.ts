import {Component, inject, AfterViewInit} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {FeaturesComponent} from '../features/features.component';
import {LandingPageComponent} from '../landing-page/landing-page.component';
import {AboutUsComponent} from '../about-us/about-us.component';
import {KeycloakService} from 'keycloak-angular';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-public-layout',
  imports: [
    RouterOutlet,
    FeaturesComponent,
    LandingPageComponent,
    AboutUsComponent,
    NgClass,
    RouterLink
],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.css'
})
export class PublicLayoutComponent implements AfterViewInit {
  keycloakService: KeycloakService = inject(KeycloakService);
  router: Router = inject(Router);
  activeSection: string = 'start';

  sections: string[] = ['start', 'features', 'about'];



  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.activeSection = entry.target.id;
          }
        });
      },
      {
        threshold: 0.6
      }
    );

    this.sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });
  }

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

  isLandingPage(): boolean {
    const path = this.router.url.split('?')[0].split('#')[0];
    return path === '' || path === '/';
  }

  scrollToSection(id: string): void {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

  }
}
