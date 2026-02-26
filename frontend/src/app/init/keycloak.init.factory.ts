import { KeycloakService} from 'keycloak-angular';
import {environment} from '../../environments/environment';

export function initializeKeycloak(keycloak: KeycloakService):() => Promise<boolean> {
  return () =>
    keycloak.init({
      config: {
        url: environment.keycloakUrl,
        realm: 'demo',
        clientId: 'frontend',
      },
      initOptions: {
        onLoad: 'login-required',
        redirectUri: window.location.origin+'/home',
        checkLoginIframe: false,
      },
      enableBearerInterceptor: true,
      bearerPrefix: 'Bearer',
      bearerExcludedUrls: ['/assets', '/public']
    })
}
