import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FeedbackBannerComponent} from '../feedback/feedback-banner/feedback-banner.component';
import {Feedback} from '../interfaces/feedback';
import {FeedbackServiceService} from '../feedback/feedback-service/feedback-service.service';
import {KeycloakService} from 'keycloak-angular';
import { PresentationComponent } from "../layout/public/presentation/presentation.component";
import {PresentationEditComponent} from '../layout/public/presentation-edit/presentation-edit.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FeedbackBannerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'

})
export class AppComponent implements OnInit {
  keycloakService: KeycloakService = inject(KeycloakService);
  feedbackService: FeedbackServiceService = inject(FeedbackServiceService);
  title = 'InStaff';

  feedback!: Feedback;

  ngOnInit(): void {
    this.feedbackService.feedback$.subscribe(feedback => {
      this.feedback = feedback;
    })

  }
}
