import { KeycloakService} from 'keycloak-angular';

export function initializeKeycloak(keycloak: KeycloakService):() => Promise<boolean> {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8081',
        realm: 'demo',
        clientId: 'frontend',
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false,
      },
      enableBearerInterceptor: true,
      bearerPrefix: 'Bearer',
      bearerExcludedUrls: ['/assets', '/public']
    })
}
