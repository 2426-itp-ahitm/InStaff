import { KeycloakService} from 'keycloak-angular';

export function initializeKeycloak(keycloak: KeycloakService):() => Promise<boolean> {
  return () =>
    keycloak.init({
      config: {
        url: 'https://it210157.cloud.htl-leonding.ac.at/auth',
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
