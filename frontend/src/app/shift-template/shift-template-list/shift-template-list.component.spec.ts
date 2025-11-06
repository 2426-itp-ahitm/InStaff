import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftTemplateListComponent } from './shift-template-list.component';

describe('ShiftTemplateListComponent', () => {
  let component: ShiftTemplateListComponent;
  let fixture: ComponentFixture<ShiftTemplateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftTemplateListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
