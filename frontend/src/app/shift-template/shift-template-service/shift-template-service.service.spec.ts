import { TestBed } from '@angular/core/testing';

import { ShiftTemplateServiceService } from './shift-template-service.service';

describe('ShiftTemplateServiceService', () => {
  let service: ShiftTemplateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftTemplateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
