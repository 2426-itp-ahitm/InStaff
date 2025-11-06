import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftTemplateAddComponent } from './shift-template-add.component';

describe('ShiftTemplateAddComponent', () => {
  let component: ShiftTemplateAddComponent;
  let fixture: ComponentFixture<ShiftTemplateAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftTemplateAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftTemplateAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
