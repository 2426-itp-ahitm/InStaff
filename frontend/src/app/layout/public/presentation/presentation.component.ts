import {Component, HostListener} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import {NgIf} from '@angular/common';


@Component({
  selector: 'app-presentation',
  imports: [
    NgIf
  ],
  templateUrl: './presentation.component.html',
  styleUrl: './presentation.component.css',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('400ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class PresentationComponent {
  slideIndex: number = 0;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') this.nextSlide();
    if (event.key === 'ArrowLeft') this.prevSlide();
  }

  nextSlide(): void {
    this.slideIndex++
  }
  prevSlide(): void {
    this.slideIndex -= 1;
  }



}
