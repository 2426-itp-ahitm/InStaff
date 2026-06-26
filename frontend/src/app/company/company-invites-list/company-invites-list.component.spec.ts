import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyInvitesListComponent } from './company-invites-list.component';

describe('CompanyInvitesListComponent', () => {
  let component: CompanyInvitesListComponent;
  let fixture: ComponentFixture<CompanyInvitesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyInvitesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyInvitesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
