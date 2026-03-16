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
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        //checkLoginIframe: false,
      },
      enableBearerInterceptor: true,
      bearerPrefix: 'Bearer',
      bearerExcludedUrls: ['/assets', '/public']
    })
}
