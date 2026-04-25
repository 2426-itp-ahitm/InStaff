import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenForRequestComponent } from './open-for-request.component';

describe('OpenForRequestDashboardComponent', () => {
  let component: OpenForRequestComponent;
  let fixture: ComponentFixture<OpenForRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenForRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenForRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
