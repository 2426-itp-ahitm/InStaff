import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Employee} from '../interfaces/employee';
import {Feedback} from '../interfaces/feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackServiceService {

  constructor() { }

  private feedbackSubject = new BehaviorSubject<Feedback>({ message: 'Welcome', type: 'info', showFeedback: false });
  public feedback$ = this.feedbackSubject.asObservable();

  newFeedback(feedback: Feedback) {
    this.feedbackSubject.next(feedback);
  }
}
