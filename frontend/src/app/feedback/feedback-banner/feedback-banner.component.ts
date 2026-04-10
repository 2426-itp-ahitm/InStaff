import {Component, inject, OnInit} from '@angular/core';
import {NgClass} from '@angular/common';
import {FeedbackServiceService} from '../feedback-service/feedback-service.service';
import {Feedback} from '../../interfaces/feedback';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-feedback-banner',
  templateUrl: './feedback-banner.component.html',
  styleUrls: ['./feedback-banner.component.css'],
  imports: [
    NgClass
  ],
  standalone: true,
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class FeedbackBannerComponent implements OnInit {

  feedbackService: FeedbackServiceService = inject(FeedbackServiceService);
  feedback!: Feedback;
  showFeedback: boolean = false;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.feedbackService.feedback$.subscribe(fd => {
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
        this.hideTimer = null;
      }

      this.showFeedback = false;

      setTimeout(() => {
        this.feedback = { ...fd };
        this.showFeedback = this.feedback.showFeedback;

        this.hideTimer = setTimeout(() => {
          this.showFeedback = false;
        }, 4000);
      }, 0);
    });
  }

  protected hideFeedback() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }

    this.showFeedback = false;
    this.feedbackService.skipFeedback();
  }
}
