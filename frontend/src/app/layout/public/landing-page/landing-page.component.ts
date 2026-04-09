import {Component, HostListener, inject} from '@angular/core';
import {Router} from '@angular/router';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  private readonly router = inject(Router);
  private readonly resumeSlideIndexStorageKey = 'presentation.resumeSlideIndex';
  private readonly jumpToDemoStorageKey = 'presentation.jumpToDemo';

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const targetElement = event.target as HTMLElement | null;
    const isTypingTarget = targetElement?.tagName === 'INPUT'
      || targetElement?.tagName === 'TEXTAREA'
      || targetElement?.isContentEditable === true;

    if (isTypingTarget) {
      return;
    }

    if (event.key.toLowerCase() === 'p') {
      window.sessionStorage.removeItem(this.resumeSlideIndexStorageKey);
      window.sessionStorage.removeItem(this.jumpToDemoStorageKey);
      event.preventDefault();
      this.router.navigate(['/presentation']);
      return;
    }

    if (event.key.toLowerCase() === 'o') {
      window.sessionStorage.setItem(this.jumpToDemoStorageKey, '1');
      event.preventDefault();
      this.router.navigate(['/presentation']);
    }
  }

}
