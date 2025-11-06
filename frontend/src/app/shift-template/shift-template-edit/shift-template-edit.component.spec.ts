import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftTemplateEditComponent } from './shift-template-edit.component';

describe('ShiftTemplateEditComponent', () => {
  let component: ShiftTemplateEditComponent;
  let fixture: ComponentFixture<ShiftTemplateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftTemplateEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftTemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
