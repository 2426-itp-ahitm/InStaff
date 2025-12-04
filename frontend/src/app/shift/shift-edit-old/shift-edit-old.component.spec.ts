import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftEditOldComponent } from './shift-edit-old.component';

describe('ShiftEditOldComponent', () => {
  let component: ShiftEditOldComponent;
  let fixture: ComponentFixture<ShiftEditOldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftEditOldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftEditOldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
