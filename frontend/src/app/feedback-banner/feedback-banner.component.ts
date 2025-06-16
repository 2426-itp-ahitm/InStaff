import {Component, inject, Input, OnInit} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {FeedbackServiceService} from '../feedback-service/feedback-service.service';
import {Feedback} from '../interfaces/feedback';

@Component({
  selector: 'app-feedback-banner',
  templateUrl: './feedback-banner.component.html',
  styleUrls: ['./feedback-banner.component.css'],
  imports: [
    NgIf,
    NgClass
  ],
  standalone: true
})
export class FeedbackBannerComponent implements OnInit {

  feedbackService:FeedbackServiceService = inject(FeedbackServiceService);
  feedback!:Feedback;
  showFeedback: Boolean=false;

  ngOnInit(): void {
    this.feedbackService.feedback$.subscribe(fd => {
      this.feedback = fd;
      this.showFeedback = this.feedback.showFeedback;
      setTimeout(() => this.showFeedback = false, 3000);
    })

  }
}
