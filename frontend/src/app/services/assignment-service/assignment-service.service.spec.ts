import { TestBed } from '@angular/core/testing';

import { AssignmentServiceService } from './assignment-service.service';

describe('AssignmentServiceService', () => {
  let service: AssignmentServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignmentServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
