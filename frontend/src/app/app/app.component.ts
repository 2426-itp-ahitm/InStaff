import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import tailwindcss from '@tailwindcss/vite'
import {MenuComponent} from '../essentials/menu/menu.component';
import {FeedbackBannerComponent} from '../feedback/feedback-banner/feedback-banner.component';
import {Feedback} from '../interfaces/feedback';
import {FeedbackServiceService} from '../feedback/feedback-service/feedback-service.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent, FeedbackBannerComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'

})
export class AppComponent implements OnInit {
  feedbackService: FeedbackServiceService = inject(FeedbackServiceService);
  title = 'frontend';

  feedback!: Feedback;

  ngOnInit(): void {
    this.feedbackService.feedback$.subscribe(feedback => {
      this.feedback = feedback;
    })

  }
}
