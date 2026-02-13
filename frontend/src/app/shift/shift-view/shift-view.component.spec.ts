import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftViewComponent } from './shift-view.component';

describe('ShiftViewComponent', () => {
  let component: ShiftViewComponent;
  let fixture: ComponentFixture<ShiftViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
