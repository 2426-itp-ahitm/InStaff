import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCompanyInviteComponent } from './new-company-invite.component';

describe('NewCompanyInviteComponent', () => {
  let component: NewCompanyInviteComponent;
  let fixture: ComponentFixture<NewCompanyInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCompanyInviteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCompanyInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
