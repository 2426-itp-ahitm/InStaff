import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftAddOldComponent } from './shift-add-old.component';

describe('ShiftAddOldComponent', () => {
  let component: ShiftAddOldComponent;
  let fixture: ComponentFixture<ShiftAddOldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftAddOldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftAddOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
