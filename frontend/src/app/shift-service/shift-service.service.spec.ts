import { TestBed } from '@angular/core/testing';

import { ShiftServiceService } from './shift-service.service';

describe('ShiftServiceService', () => {
  let service: ShiftServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
