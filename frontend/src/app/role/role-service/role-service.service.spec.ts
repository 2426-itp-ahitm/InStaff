import { TestBed } from '@angular/core/testing';

import { RoleServiceService } from './role-service.service';

describe('RoleServiceService', () => {
  let service: RoleServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
