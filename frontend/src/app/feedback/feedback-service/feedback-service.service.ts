import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Employee} from '../../interfaces/employee';
import {Feedback} from '../../interfaces/feedback';
import {waitForAsync} from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
// ... existing code ...

export class FeedbackServiceService {

  constructor() { }

  private feedbackSubject = new BehaviorSubject<Feedback>({ message: 'Welcome', type: 'info', showFeedback: false });
  public feedback$ = this.feedbackSubject.asObservable();

  private feedbackList: Feedback[] = [];
  private feedbackIsShown = false;
  private waitingTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly waitingTime = 4000;

  newFeedback(feedback: Feedback) {
    this.feedbackList.push(feedback);
    if (!this.feedbackIsShown) {
      this.showFeedbacks();
    }
  }

  showFeedbacks(): void {
    this.feedbackIsShown = true;

    const feedback = this.feedbackList[0];
    if (!feedback) {
      this.feedbackIsShown = false;
      return;
    }

    this.feedbackSubject.next(feedback);
    this.feedbackList = this.feedbackList.slice(1);

    if (this.waitingTimer) {
      clearTimeout(this.waitingTimer);
    }

    this.waitingTimer = setTimeout(() => {
      if (this.feedbackList.length > 0) {
        this.showFeedbacks();
      } else {
        this.feedbackIsShown = false;
      }
    }, this.waitingTime);
  }

  skipFeedback(): void {
    if (this.waitingTimer) {
      clearTimeout(this.waitingTimer);
      this.waitingTimer = null;
    }

    if (this.feedbackList.length > 0) {
      this.showFeedbacks();
    } else {
      this.feedbackIsShown = false;
    }
  }
}
