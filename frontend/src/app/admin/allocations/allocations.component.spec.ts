import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationsComponent } from './allocations.component';

describe('AllocationsComponent', () => {
  let component: AllocationsComponent;
  let fixture: ComponentFixture<AllocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllocationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
