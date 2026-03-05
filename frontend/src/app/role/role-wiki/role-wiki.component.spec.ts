import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleWikiComponent } from './role-wiki.component';

describe('RoleWikiComponent', () => {
  let component: RoleWikiComponent;
  let fixture: ComponentFixture<RoleWikiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleWikiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleWikiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
