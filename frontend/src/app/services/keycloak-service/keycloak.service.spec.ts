import { TestBed } from '@angular/core/testing';

import { KeycloakOperationService } from './keycloak.service';

describe('KeycloakService', () => {
  let service: KeycloakOperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeycloakOperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
