import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageComponent } from './landing-page.component';
import {Router} from '@angular/router';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  const resumeSlideIndexStorageKey = 'presentation.resumeSlideIndex';

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    window.sessionStorage.clear();

    await TestBed.configureTestingModule({
      imports: [LandingPageComponent],
      providers: [{provide: Router, useValue: routerSpy}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    window.sessionStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('navigates to the first slide with P and clears the resume state', () => {
    window.sessionStorage.setItem(resumeSlideIndexStorageKey, '2');

    component.onKeydown({key: 'p', preventDefault: jasmine.createSpy('preventDefault'), target: null} as unknown as KeyboardEvent);

    expect(window.sessionStorage.getItem(resumeSlideIndexStorageKey)).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/presentation']);
  });

  it('navigates back to the demo slide with O without clearing the resume state', () => {
    window.sessionStorage.setItem(resumeSlideIndexStorageKey, '2');

    component.onKeydown({key: 'o', preventDefault: jasmine.createSpy('preventDefault'), target: null} as unknown as KeyboardEvent);

    expect(window.sessionStorage.getItem(resumeSlideIndexStorageKey)).toBe('2');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/presentation']);
  });
});
