import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftOverviewComponent } from './shift-overview.component';

describe('ShiftOverviewComponent', () => {
  let component: ShiftOverviewComponent;
  let fixture: ComponentFixture<ShiftOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
