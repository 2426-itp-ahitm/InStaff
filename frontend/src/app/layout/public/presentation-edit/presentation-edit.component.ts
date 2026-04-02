import {Component, HostListener, ViewEncapsulation, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Presentation} from '../../../interfaces/presentation';
import {Slide} from '../../../interfaces/slide';
import {SlideContent} from '../../../interfaces/slide-content';
import {Animation} from '../../../interfaces/animation';

@Component({
  selector: 'app-presentation-edit',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './presentation-edit.component.html',
  styleUrl: './presentation-edit.component.css',
  encapsulation: ViewEncapsulation.None
})
export class PresentationEditComponent {
  private readonly http = inject(HttpClient);

  presentation: Presentation = {
    name: 'Neue Praesentation',
    slides: [
      {
        id: 1,
        content: []
      }
    ]
  };

  animations: Animation[] = [];
  infoMessage = '';
  previewSlideIndex = 0;
  editingContentSource: {slideId: number; contentId: number} | null = null;

  readonly animationTypes: Animation['type'][] = [
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

  readonly presentationForm = new FormGroup({
    name: new FormControl('Neue Praesentation', {nonNullable: true, validators: [Validators.required]})
  });

  readonly animationForm = new FormGroup({
    type: new FormControl<Animation['type']>('fadeIn', {nonNullable: true, validators: [Validators.required]}),
    duration: new FormControl(600, {nonNullable: true, validators: [Validators.required, Validators.min(0)]}),
    delay: new FormControl(0, {nonNullable: true, validators: [Validators.required, Validators.min(0)]})
  });

  readonly contentForm = new FormGroup({
    id: new FormControl(1, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    text: new FormControl('', {nonNullable: true}),
    image: new FormControl('', {nonNullable: true}),
    video: new FormControl('', {nonNullable: true}),
    scale: new FormControl(100, {nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(300)]}),
    zIndex: new FormControl(1, {nonNullable: true, validators: [Validators.required]}),
    positionX: new FormControl(0, {nonNullable: true, validators: [Validators.required]}),
    positionY: new FormControl(0, {nonNullable: true, validators: [Validators.required]}),
    inAnimationIndex: new FormControl<number | null>(null),
    outAnimationIndex: new FormControl<number | null>(null)
  });

  constructor() {
    this.loadSharedPresentation();
  }

  @HostListener('window:beforeunload', ['$event'])
  confirmReload(event: BeforeUnloadEvent): void {
    event.preventDefault();
    event.returnValue = '';
  }

  get previewSlide(): Slide | null {
    if (this.presentation.slides.length === 0) {
      return null;
    }

    if (this.previewSlideIndex < 0) {
      this.previewSlideIndex = 0;
    }

    if (this.previewSlideIndex >= this.presentation.slides.length) {
      this.previewSlideIndex = this.presentation.slides.length - 1;
    }

    return this.presentation.slides[this.previewSlideIndex] ?? null;
  }

  get editingContent(): boolean {
    return this.editingContentSource !== null;
  }

  updatePresentationMeta(): void {
    if (this.presentationForm.invalid) {
      this.infoMessage = 'Bitte einen gueltigen Namen eingeben.';
      return;
    }

    this.presentation.name = this.presentationForm.controls.name.value.trim();
    this.infoMessage = 'Praesentation aktualisiert.';
  }

  addSlide(): void {
    const slideId = this.getNextSlideId();

    const newSlide: Slide = {
      id: slideId,
      content: []
    };

    this.presentation.slides.push(newSlide);
    this.infoMessage = `Slide ${slideId} wurde hinzugefuegt.`;
    this.previewSlideIndex = this.presentation.slides.length - 1;
  }

  deleteSlide(slideId: number): void {
    const existingSlide = this.presentation.slides.find(slide => slide.id === slideId);
    if (!existingSlide) {
      this.infoMessage = `Slide ${slideId} existiert nicht.`;
      return;
    }

    const confirmed = window.confirm(`Slide ${slideId} wirklich loeschen?`);
    if (!confirmed) {
      return;
    }

    this.presentation.slides = this.presentation.slides.filter(slide => slide.id !== slideId);
    this.previewSlideIndex = Math.max(0, Math.min(this.previewSlideIndex, this.presentation.slides.length - 1));

    if (this.editingContentSource?.slideId === slideId) {
      this.cancelContentEdit();
    }

    this.infoMessage = `Slide ${slideId} wurde geloescht.`;
  }

  toggleScrollTrigger(slideId: number): void {
    const targetSlide = this.presentation.slides.find(slide => slide.id === slideId);
    if (!targetSlide) {
      return;
    }

    // Remove scroll trigger from all other slides
    this.presentation.slides.forEach(slide => {
      if (slide.id !== slideId) {
        slide.isScrollTrigger = false;
      }
    });

    // Toggle for current slide
    targetSlide.isScrollTrigger = !targetSlide.isScrollTrigger;
    this.infoMessage = targetSlide.isScrollTrigger 
      ? `Slide ${slideId} ist jetzt die Scroll-Trigger Slide.` 
      : `Scroll-Trigger wurde von Slide ${slideId} entfernt.`;
  }

  addAnimation(): void {
    if (this.animationForm.invalid) {
      this.infoMessage = 'Bitte gueltige Animationsdaten eingeben.';
      return;
    }

    const newAnimation: Animation = {
      type: this.animationForm.controls.type.value,
      duration: this.animationForm.controls.duration.value,
      delay: this.animationForm.controls.delay.value
    };

    this.animations.push(newAnimation);
    this.infoMessage = `Animation ${this.animations.length} wurde hinzugefuegt.`;

    if (this.animations.length === 1) {
      this.contentForm.patchValue({
        inAnimationIndex: 0,
        outAnimationIndex: 0
      });
    }
  }

  addContentToSlide(): void {
    this.saveContent();
  }

  saveContent(): void {
    if (this.contentForm.invalid) {
      this.infoMessage = 'Bitte gueltige Content-Daten eingeben.';
      return;
    }

    const targetSlide = this.previewSlide;

    if (!targetSlide) {
      this.infoMessage = 'Keine ausgewaehlte Slide gefunden.';
      return;
    }

    const slideId = targetSlide.id;

    const inAnimationIndex = this.contentForm.controls.inAnimationIndex.value;
    const outAnimationIndex = this.contentForm.controls.outAnimationIndex.value;
    const inAnimation = this.getAnimationByIndex(inAnimationIndex);
    const outAnimation = this.getAnimationByIndex(outAnimationIndex);

    const contentId = this.editingContentSource
      ? this.contentForm.controls.id.value
      : this.getNextContentId(targetSlide);

    const rawText = this.contentForm.controls.text.value.trim();
    const rawImage = this.contentForm.controls.image.value.trim();
    const rawVideo = this.contentForm.controls.video.value.trim();
    if (!rawText && !rawImage && !rawVideo) {
      this.infoMessage = 'Bitte mindestens Text, Bild oder Video setzen.';
      return;
    }

    const newContent: SlideContent = {
      id: contentId,
      slideId,
      text: rawText || null,
      image: rawImage || null,
      video: rawVideo || null,
      scale: this.clampScale(this.contentForm.controls.scale.value),
      zIndex: this.contentForm.controls.zIndex.value,
      positionX: this.clampPercent(this.contentForm.controls.positionX.value),
      positionY: this.clampPercent(this.contentForm.controls.positionY.value),
      inAnimation,
      outAnimation
    };

    if (this.editingContentSource) {
      this.applyContentUpdate(targetSlide, newContent);
      return;
    }

    if (targetSlide.content.some(content => content.id === contentId)) {
      this.infoMessage = `Content mit ID ${contentId} existiert in Slide ${slideId} bereits.`;
      return;
    }

    targetSlide.content.push(newContent);
    this.infoMessage = `Content ${contentId} wurde zu Slide ${slideId} hinzugefuegt.`;
    this.contentForm.patchValue({id: contentId + 1, text: '', image: '', video: '', scale: 100});
  }

  startEditContent(slideId: number, contentId: number): void {
    const targetSlide = this.presentation.slides.find(slide => slide.id === slideId);
    const content = targetSlide?.content.find(entry => entry.id === contentId);

    if (!targetSlide || !content) {
      this.infoMessage = 'Content zum Bearbeiten wurde nicht gefunden.';
      return;
    }

    this.editingContentSource = {slideId, contentId};
    this.contentForm.patchValue({
      id: content.id,
      text: content.text ?? '',
      image: content.image ?? '',
      video: content.video ?? '',
      scale: this.clampScale(content.scale ?? 100),
      zIndex: content.zIndex,
      positionX: content.positionX,
      positionY: content.positionY,
      inAnimationIndex: this.getAnimationIndex(content.inAnimation),
      outAnimationIndex: this.getAnimationIndex(content.outAnimation)
    });
    this.infoMessage = `Content ${contentId} wird bearbeitet.`;
  }

  cancelContentEdit(): void {
    this.editingContentSource = null;
    this.contentForm.patchValue({text: '', image: '', video: '', scale: 100});
    this.infoMessage = 'Bearbeitung abgebrochen.';
  }

  deleteContent(slideId: number, contentId: number): void {
    const targetSlide = this.presentation.slides.find(slide => slide.id === slideId);
    if (!targetSlide) {
      this.infoMessage = `Slide ${slideId} existiert nicht.`;
      return;
    }

    const beforeLength = targetSlide.content.length;
    targetSlide.content = targetSlide.content.filter(content => content.id !== contentId);
    if (targetSlide.content.length === beforeLength) {
      this.infoMessage = `Content ${contentId} wurde nicht gefunden.`;
      return;
    }

    if (this.editingContentSource?.slideId === slideId && this.editingContentSource.contentId === contentId) {
      this.cancelContentEdit();
    }

    this.infoMessage = `Content ${contentId} wurde geloescht.`;
  }

  goToPreviewSlide(index: number): void {
    if (index < 0 || index >= this.presentation.slides.length) {
      return;
    }
    this.previewSlideIndex = index;
  }

  nextPreviewSlide(): void {
    if (this.presentation.slides.length === 0) {
      return;
    }
    this.previewSlideIndex = (this.previewSlideIndex + 1) % this.presentation.slides.length;
  }

  previousPreviewSlide(): void {
    if (this.presentation.slides.length === 0) {
      return;
    }
    this.previewSlideIndex = (this.previewSlideIndex - 1 + this.presentation.slides.length) % this.presentation.slides.length;
  }

  uploadPresentation(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    file.text()
      .then(content => {
        const uploadedPresentation = this.parsePresentationText(content);

        if (!uploadedPresentation) {
          this.infoMessage = 'Datei hat kein gueltiges Presentation-Format.';
          return;
        }

        this.applyLoadedPresentation(uploadedPresentation);
        this.infoMessage = 'Praesentation geladen. Seite neu laden, um eine andere neue Session zu starten.';
      })
      .catch(() => {
        this.infoMessage = 'JSON-Datei konnte nicht geladen werden.';
      })
      .finally(() => {
        input.value = '';
      });
  }

  private getAnimationByIndex(index: number | null): Animation | null {
    if (index === null || index < 0 || index >= this.animations.length) {
      return null;
    }

    const animation = this.animations[index];
    return {
      type: animation.type,
      duration: animation.duration,
      delay: animation.delay
    };
  }

  exportPresentationAsJson(): void {
    const json = JSON.stringify(this.presentation, null, 2);
    const blob = new Blob([json], {type: 'text/javascript'});
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.presentation.name || 'presentation'}.js`;
    link.click();

    URL.revokeObjectURL(url);
    this.infoMessage = 'Praesentation als JS exportiert.';
  }

  getPreviewContentStyles(content: SlideContent): Record<string, string | number> {
    const positionX = this.clampPercent(content.positionX);
    const positionY = this.clampPercent(content.positionY);

    return {
      left: `${positionX}%`,
      top: `${positionY}%`,
      transform: 'translate(-50%, -50%)',
      'z-index': content.zIndex
    };
  }

  getPreviewMediaStyles(content: SlideContent): Record<string, string> {
    const scaleFactor = this.clampScale(content.scale ?? 100) / 100;

    return {
      transform: `scale(${scaleFactor})`,
      'transform-origin': 'center center'
    };
  }

  getPreviewSlideStyle(index: number): Record<string, string> {
    return {
      backgroundColor: this.previewSlideIndex === index ? '#3A5A40' : '#d1d5db'
    };
  }

  private getNextSlideId(): number {
    if (this.presentation.slides.length === 0) {
      return 1;
    }

    const maxId = Math.max(...this.presentation.slides.map(slide => slide.id));
    return maxId + 1;
  }

  private getNextContentId(slide: Slide): number {
    if (slide.content.length === 0) {
      return 1;
    }

    const maxId = Math.max(...slide.content.map(content => content.id));
    return maxId + 1;
  }

  private applyContentUpdate(targetSlide: Slide, updatedContent: SlideContent): void {
    const source = this.editingContentSource;
    if (!source) {
      return;
    }

    const sourceSlide = this.presentation.slides.find(slide => slide.id === source.slideId);
    if (!sourceSlide) {
      this.editingContentSource = null;
      this.infoMessage = 'Original-Slide fuer die Bearbeitung nicht gefunden.';
      return;
    }

    const sourceIndex = sourceSlide.content.findIndex(content => content.id === source.contentId);
    if (sourceIndex < 0) {
      this.editingContentSource = null;
      this.infoMessage = 'Original-Content fuer die Bearbeitung nicht gefunden.';
      return;
    }

    const duplicateInTarget = targetSlide.content.some(content => {
      const isOriginalEntry = targetSlide.id === source.slideId && content.id === source.contentId;
      return !isOriginalEntry && content.id === updatedContent.id;
    });

    if (duplicateInTarget) {
      this.infoMessage = `Content mit ID ${updatedContent.id} existiert in Slide ${targetSlide.id} bereits.`;
      return;
    }

    sourceSlide.content.splice(sourceIndex, 1);
    targetSlide.content.push(updatedContent);

    this.editingContentSource = null;
    this.infoMessage = `Content ${updatedContent.id} wurde aktualisiert.`;
    this.contentForm.patchValue({id: updatedContent.id + 1, text: '', image: '', video: '', scale: 100});
  }

  private loadSharedPresentation(): void {
    this.http.get('/presentation.js', {responseType: 'text'}).subscribe({
      next: (fileContent: string) => {
        const parsed = this.parsePresentationText(fileContent);
        if (!parsed) {
          this.infoMessage = 'presentation.js konnte nicht als gueltige Praesentation gelesen werden.';
          return;
        }

        this.applyLoadedPresentation(parsed);
        this.infoMessage = 'Praesentation aus presentation.js geladen.';
      },
      error: () => {
        this.infoMessage = 'presentation.js konnte nicht geladen werden. Standard-Praesentation aktiv.';
      }
    });
  }

  private applyLoadedPresentation(loaded: Presentation): void {
    this.presentation = loaded;
    if (this.presentation.slides.length === 0) {
      this.presentation.slides = [{id: 1, content: []}];
    }

    this.animations = this.collectAnimations(this.presentation);
    this.presentationForm.patchValue({name: loaded.name});
    this.previewSlideIndex = 0;
    this.editingContentSource = null;
    this.contentForm.patchValue({
      id: 1,
      text: '',
      image: '',
      video: '',
      scale: 100,
      inAnimationIndex: null,
      outAnimationIndex: null
    });
  }

  private collectAnimations(presentation: Presentation): Animation[] {
    const uniqueAnimations: Animation[] = [];

    const pushIfUnique = (candidate: Animation | null): void => {
      if (!candidate) {
        return;
      }

      const exists = uniqueAnimations.some(animation => (
        animation.type === candidate.type
        && animation.duration === candidate.duration
        && animation.delay === candidate.delay
      ));

      if (!exists) {
        uniqueAnimations.push(candidate);
      }
    };

    for (const slide of presentation.slides) {
      for (const content of slide.content) {
        pushIfUnique(content.inAnimation);
        pushIfUnique(content.outAnimation);
      }
    }

    return uniqueAnimations;
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

  private getAnimationIndex(animation: Animation | null): number | null {
    if (!animation) {
      return null;
    }

    const animationIndex = this.animations.findIndex(candidate => (
      candidate.type === animation.type
      && candidate.duration === animation.duration
      && candidate.delay === animation.delay
    ));

    return animationIndex >= 0 ? animationIndex : null;
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
      if (!slideRaw || typeof slideRaw !== 'object') {
        return null;
      }

      const slideData = slideRaw as Record<string, unknown>;
      if (typeof slideData['id'] !== 'number' || !Array.isArray(slideData['content'])) {
        return null;
      }

      const content: SlideContent[] = [];
      for (const contentRaw of slideData['content']) {
        const normalized = this.parseSlideContent(contentRaw, slideData['id']);
        if (!normalized) {
          return null;
        }
        content.push(normalized);
      }

      slides.push({id: slideData['id'], content, isScrollTrigger: slideData['isScrollTrigger'] === true});
    }

    return {
      name: data['name'],
      slides
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

    const resolvedSlideId = typeof data['slideId'] === 'number' ? data['slideId'] : fallbackSlideId;
    const resolvedText = typeof data['text'] === 'string' ? data['text'] : null;
    const resolvedImage = typeof data['image'] === 'string' ? data['image'] : null;
    const resolvedVideo = typeof data['video'] === 'string' ? data['video'] : null;
    const resolvedScale = this.parseScaleValue(data['scale']);
    const zIndex = typeof data['zIndex'] === 'number' ? data['zIndex'] : 1;
    const positionX = this.parsePercentValue(data['positionX']);
    const positionY = this.parsePercentValue(data['positionY']);

    return {
      id: data['id'],
      slideId: resolvedSlideId,
      text: resolvedText,
      image: resolvedImage,
      video: resolvedVideo,
      scale: resolvedScale,
      zIndex,
      positionX,
      positionY,
      inAnimation: this.parseAnimation(raw, 'inAnimation'),
      outAnimation: this.parseAnimation(raw, 'outAnimation')
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

  private parseAnimation(raw: unknown, key: 'inAnimation' | 'outAnimation'): Animation | null {
    if (!raw || typeof raw !== 'object') {
      return null;
    }

    const data = raw as Record<string, unknown>;
    const animationValue = data[key];
    if (animationValue === null || animationValue === undefined) {
      return null;
    }

    if (!animationValue || typeof animationValue !== 'object') {
      return null;
    }

    const animation = animationValue as Record<string, unknown>;
    if (typeof animation['type'] !== 'string') {
      return null;
    }

    if (!this.animationTypes.includes(animation['type'] as Animation['type'])) {
      return null;
    }

    const duration = typeof animation['duration'] === 'number' ? animation['duration'] : 0;
    const delay = typeof animation['delay'] === 'number' ? animation['delay'] : 0;

    return {
      type: animation['type'] as Animation['type'],
      duration,
      delay
    };
  }

}
