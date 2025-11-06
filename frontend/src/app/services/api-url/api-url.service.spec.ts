import { TestBed } from '@angular/core/testing';

import { ApiUrlService } from './api-url.service';

describe('ApiUrlService', () => {
  let service: ApiUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
