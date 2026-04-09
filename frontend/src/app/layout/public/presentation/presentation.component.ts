import {animate, style, transition, trigger} from '@angular/animations';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Component, HostListener, OnInit, ViewChildren, QueryList, inject, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {Animation} from '../../../interfaces/animation';
import {Presentation} from '../../../interfaces/presentation';
import {Slide} from '../../../interfaces/slide';
import {SlideContent} from '../../../interfaces/slide-content';


@Component({
  selector: 'app-presentation',
  imports: [
    CommonModule
  ],
  templateUrl: './presentation.component.html',
  styleUrl: './presentation.component.css',
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('slideIn', [
      transition('* => *', [
        style({opacity: 0, transform: 'translateX(2%)'}),
        animate('300ms ease-out', style({opacity: 1, transform: 'translateX(0)'}))
      ])
    ])
  ]
})
export class PresentationComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly resumeSlideIndexStorageKey = 'presentation.resumeSlideIndex';

    @ViewChildren('videoElement') videoElements!: QueryList<any>;

  presentation: Presentation | null = null;
  slideIndex = 0;
  isLoading = true;
  errorMessage = '';
  private scrollTimeout: number | null = null;

  ngOnInit(): void {
    this.loadPresentation();
  }

  get currentSlide(): Slide | null {
    if (!this.presentation || this.presentation.slides.length === 0) {
      return null;
    }

    if (this.slideIndex < 0) {
      this.slideIndex = 0;
    }
    if (this.slideIndex >= this.presentation.slides.length) {
      this.slideIndex = this.presentation.slides.length - 1;
    }

    return this.presentation.slides[this.slideIndex] ?? null;
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.nextSlide();
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.prevSlide();
    }
  }

  @HostListener('window:wheel', ['$event'])
  onScroll(event: WheelEvent): void {
    // Only handle scroll down
    if (event.deltaY <= 0) {
      return;
    }

    // Check if current slide is marked as scroll trigger
    if (!this.currentSlide || !this.currentSlide.isScrollTrigger) {
      return;
    }

    // Prevent default scroll behavior and navigate
    event.preventDefault();
    this.navigateToLandingPage();
  }

  nextSlide(): void {
    if (!this.presentation || this.presentation.slides.length === 0) {
      return;
    }

    if (this.slideIndex < this.presentation.slides.length - 1) {
      this.slideIndex += 1;
        this.playSlideVideos();
    }
  }

  prevSlide(): void {
    if (!this.presentation || this.presentation.slides.length === 0) {
      return;
    }

    if (this.slideIndex > 0) {
      this.slideIndex -= 1;
      this.playSlideVideos();
    }
  }

  private navigateToLandingPage(): void {
    // Debounce rapid scroll events
    if (this.scrollTimeout !== null) {
      return;
    }

    if (this.currentSlide?.isScrollTrigger) {
      window.sessionStorage.setItem(this.resumeSlideIndexStorageKey, String(this.slideIndex));
    }

    this.scrollTimeout = window.setTimeout(() => {
      this.scrollTimeout = null;
    }, 800);

    this.router.navigate(['/']);
  }

  private getResumeSlideIndex(): number {
    const storedValue = window.sessionStorage.getItem(this.resumeSlideIndexStorageKey);
    if (storedValue === null) {
      return 0;
    }

    window.sessionStorage.removeItem(this.resumeSlideIndexStorageKey);

    const parsedIndex = Number(storedValue);
    if (!Number.isInteger(parsedIndex) || parsedIndex < 0 || !this.presentation) {
      return 0;
    }

    const slide = this.presentation.slides[parsedIndex];
    return slide?.isScrollTrigger === true ? parsedIndex : 0;
  }
  
    private playSlideVideos(): void {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        if (this.videoElements) {
          this.videoElements.forEach(video => {
            if (video.nativeElement) {
              video.nativeElement.currentTime = 0;
              video.nativeElement.play().catch(() => {
                // Autoplay might be blocked by browser, ignore the error
              });
            }
          });
        }
      }, 100);
    }

  getContentStyles(content: SlideContent): Record<string, string | number> {
    const baseX = content.centerHorizontal === true ? 50 : content.positionX;
    const baseY = content.centerVertical === true ? 50 : content.positionY;
    const positionX = this.clampPercent(baseX);
    const positionY = this.clampPercent(baseY);

    const styles: Record<string, string | number> = {
      left: `${positionX}%`,
      top: `${positionY}%`,
      transform: 'translate(-50%, -50%)',
      'z-index': content.zIndex,
      color: '#ffffff'
    };

    return styles;
  }

  getContentAnimation(content: SlideContent): string | null {
    if (!content.inAnimation) {
      return null;
    }
    return this.toCssAnimation(content.inAnimation);
  }

  getMediaStyles(content: SlideContent): Record<string, string> {
    const scaleFactor = this.clampScale(content.scale ?? 100) / 100;

    return {
      transform: `scale(${scaleFactor})`,
      'transform-origin': 'center center'
    };
  }

  private toCssAnimation(animation: Animation): string {
    return `${animation.type} ${animation.duration}ms ease ${animation.delay}ms both`;
  }

  private loadPresentation(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get('/presentation.js', {responseType: 'text'}).subscribe({
      next: (fileContent: string) => {
        const parsed = this.parsePresentationText(fileContent);
        if (!parsed) {
          this.errorMessage = 'presentation.js konnte nicht als gueltige Praesentation gelesen werden.';
          this.presentation = null;
          this.isLoading = false;
          return;
        }

        this.presentation = parsed;
        this.slideIndex = this.getResumeSlideIndex();
        this.playSlideVideos();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'presentation.js konnte nicht geladen werden.';
        this.presentation = null;
        this.isLoading = false;
      }
    });
  }

  private parsePresentationText(raw: string): Presentation | null {
    const trimmed = raw.trim();

    const directJson = this.tryParseJson(trimmed);
    if (directJson) {
      return directJson;
    }

    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace < 0 || lastBrace <= firstBrace) {
      return null;
    }

    return this.tryParseJson(trimmed.slice(firstBrace, lastBrace + 1));
  }

  private tryParseJson(rawJson: string): Presentation | null {
    try {
      const parsed = JSON.parse(rawJson);
      return this.parsePresentation(parsed);
    } catch {
      return null;
    }
  }

  private parsePresentation(raw: unknown): Presentation | null {
    if (!raw || typeof raw !== 'object') {
      return null;
    }

    const data = raw as Record<string, unknown>;
    if (typeof data['name'] !== 'string' || !Array.isArray(data['slides'])) {
      return null;
    }

    const slides: Slide[] = [];
    for (const slideRaw of data['slides']) {
      const parsedSlide = this.parseSlide(slideRaw);
      if (!parsedSlide) {
        return null;
      }
      slides.push(parsedSlide);
    }

    return {
      name: data['name'],
      slides
    };
  }

  private parseSlide(raw: unknown): Slide | null {
    if (!raw || typeof raw !== 'object') {
      return null;
    }

    const data = raw as Record<string, unknown>;
    if (typeof data['id'] !== 'number' || !Array.isArray(data['content'])) {
      return null;
    }

    const content: SlideContent[] = [];
    for (const contentRaw of data['content']) {
      const parsedContent = this.parseSlideContent(contentRaw, data['id']);
      if (!parsedContent) {
        return null;
      }
      content.push(parsedContent);
    }

    return {
      id: data['id'],
      content,
      isScrollTrigger: data['isScrollTrigger'] === true
    };
  }

  private parseSlideContent(raw: unknown, fallbackSlideId: number): SlideContent | null {
    if (!raw || typeof raw !== 'object') {
      return null;
    }

    const data = raw as Record<string, unknown>;
    if (typeof data['id'] !== 'number') {
      return null;
    }

    return {
      id: data['id'],
      slideId: typeof data['slideId'] === 'number' ? data['slideId'] : fallbackSlideId,
      text: typeof data['text'] === 'string' ? data['text'] : null,
      image: typeof data['image'] === 'string' ? data['image'] : null,
      video: typeof data['video'] === 'string' ? data['video'] : null,
      scale: this.parseScaleValue(data['scale']),
      zIndex: typeof data['zIndex'] === 'number' ? data['zIndex'] : 1,
      positionX: this.parsePercentValue(data['positionX']),
      positionY: this.parsePercentValue(data['positionY']),
      centerHorizontal: data['centerHorizontal'] === true,
      centerVertical: data['centerVertical'] === true,
      inAnimation: this.parseAnimationObject(data['inAnimation']),
      outAnimation: this.parseAnimationObject(data['outAnimation'])
    };
  }

  private parsePercentValue(value: unknown): number {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return this.clampPercent(value);
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      const normalized = trimmed.endsWith('%') ? trimmed.slice(0, -1) : trimmed;
      const parsed = Number(normalized);
      if (Number.isFinite(parsed)) {
        return this.clampPercent(parsed);
      }
    }

    return 0;
  }

  private clampPercent(value: number): number {
    return Math.max(0, Math.min(100, value));
  }

  private parseScaleValue(value: unknown): number {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return this.clampScale(value);
    }

    if (typeof value === 'string') {
      const parsed = Number(value.trim());
      if (Number.isFinite(parsed)) {
        return this.clampScale(parsed);
      }
    }

    return 100;
  }

  private clampScale(value: number): number {
    return Math.max(1, Math.min(300, value));
  }

  private parseAnimationObject(raw: unknown): Animation | null {
    if (raw === null || raw === undefined) {
      return null;
    }
    if (!raw || typeof raw !== 'object') {
      return null;
    }

    const data = raw as Record<string, unknown>;
    if (typeof data['type'] !== 'string') {
      return null;
    }

    const type = data['type'] as Animation['type'];
    const supportedTypes: Animation['type'][] = [
      'fadeIn',
      'fadeInLeft',
      'fadeInRight',
      'fadeInBottom',
      'fadeInTop',
      'fadeOut',
      'fadeOutLeft',
      'fadeOutRight',
      'fadeOutBottom',
      'fadeOutTop'
    ];

    if (!supportedTypes.includes(type)) {
      return null;
    }

    return {
      type,
      duration: typeof data['duration'] === 'number' ? data['duration'] : 0,
      delay: typeof data['delay'] === 'number' ? data['delay'] : 0
    };
  }


}
