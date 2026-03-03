import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeShiftOverviewComponent } from './employee-shift-overview.component';

describe('EmployeeShiftOverviewComponent', () => {
  let component: EmployeeShiftOverviewComponent;
  let fixture: ComponentFixture<EmployeeShiftOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeShiftOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeShiftOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
