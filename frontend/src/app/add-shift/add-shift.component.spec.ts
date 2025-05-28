import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShiftComponent } from './add-shift.component';

describe('AddShiftComponent', () => {
  let component: AddShiftComponent;
  let fixture: ComponentFixture<AddShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddShiftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
