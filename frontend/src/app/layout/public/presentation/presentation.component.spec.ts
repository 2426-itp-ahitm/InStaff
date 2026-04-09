import { ComponentFixture, TestBed } from '@angular/core/testing';
import {of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

import { PresentationComponent } from './presentation.component';

describe('PresentationComponent', () => {
  let component: PresentationComponent;
  let fixture: ComponentFixture<PresentationComponent>;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let routerSpy: jasmine.SpyObj<Router>;
  const resumeSlideIndexStorageKey = 'presentation.resumeSlideIndex';
  const jumpToDemoStorageKey = 'presentation.jumpToDemo';

  const presentationResponse = JSON.stringify({
    name: 'Demo',
    slides: [
      {id: 1, content: []},
      {id: 2, content: [{id: 21, slideId: 2, text: '<div class="bg-gradient text-h1">Demo</div>'}], isScrollTrigger: true},
      {id: 3, content: []}
    ]
  });

  beforeEach(async () => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    httpSpy.get.and.returnValue(of(presentationResponse));
    window.sessionStorage.clear();

    await TestBed.configureTestingModule({
      imports: [PresentationComponent],
      providers: [
        {provide: HttpClient, useValue: httpSpy},
        {provide: Router, useValue: routerSpy}
      ]
    })
    .compileComponents();
  });

  afterEach(() => {
    window.sessionStorage.clear();
  });

  beforeEach(() => {

    fixture = TestBed.createComponent(PresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('restores the scroll-trigger slide when a resume index is stored', () => {
    window.sessionStorage.setItem(resumeSlideIndexStorageKey, '1');

    fixture = TestBed.createComponent(PresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.slideIndex).toBe(1);
    expect(window.sessionStorage.getItem(resumeSlideIndexStorageKey)).toBeNull();
  });

  it('prioritizes demo slide when demo-jump flag is stored', () => {
    window.sessionStorage.setItem(resumeSlideIndexStorageKey, '0');
    window.sessionStorage.setItem(jumpToDemoStorageKey, '1');

    fixture = TestBed.createComponent(PresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.slideIndex).toBe(1);
    expect(window.sessionStorage.getItem(jumpToDemoStorageKey)).toBeNull();
  });

  it('stores the current scroll-trigger slide before navigating away', () => {
    component.slideIndex = 1;

    component.onScroll({deltaY: 1, preventDefault: jasmine.createSpy('preventDefault')} as unknown as WheelEvent);

    expect(window.sessionStorage.getItem(resumeSlideIndexStorageKey)).toBe('1');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('jumps to the demo slide on O key press', () => {
    component.slideIndex = 0;

    component.onKeyDown({key: 'o', preventDefault: jasmine.createSpy('preventDefault')} as unknown as KeyboardEvent);

    expect(component.slideIndex).toBe(1);
  });
});
