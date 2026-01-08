import { APP_INITIALIZER, Provider } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { initializeKeycloak } from './app/init/keycloak.init.factory';

export const provideKeycloak: Provider[] = [
  {
    provide: APP_INITIALIZER,
    useFactory: initializeKeycloak,
    multi: true,
    deps: [KeycloakService]
  }
];
