import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageComponent } from './landing-page.component';
import {Router} from '@angular/router';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  const resumeSlideIndexStorageKey = 'presentation.resumeSlideIndex';
  const jumpToDemoStorageKey = 'presentation.jumpToDemo';

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
    window.sessionStorage.setItem(jumpToDemoStorageKey, '1');

    component.onKeydown({key: 'p', preventDefault: jasmine.createSpy('preventDefault'), target: null} as unknown as KeyboardEvent);

    expect(window.sessionStorage.getItem(resumeSlideIndexStorageKey)).toBeNull();
    expect(window.sessionStorage.getItem(jumpToDemoStorageKey)).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/presentation']);
  });

  it('navigates to presentation with O and sets the demo jump flag', () => {
    window.sessionStorage.setItem(resumeSlideIndexStorageKey, '2');

    component.onKeydown({key: 'o', preventDefault: jasmine.createSpy('preventDefault'), target: null} as unknown as KeyboardEvent);

    expect(window.sessionStorage.getItem(jumpToDemoStorageKey)).toBe('1');
    expect(window.sessionStorage.getItem(resumeSlideIndexStorageKey)).toBe('2');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/presentation']);
  });
});
