import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCalendarComponent } from './employee-calendar.component';

describe('EmployeeCalendarComponent', () => {
  let component: EmployeeCalendarComponent;
  let fixture: ComponentFixture<EmployeeCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
