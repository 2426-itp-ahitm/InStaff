import { inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { NewsWebsocketServiceService } from '../news-websocket-serivce/news-websocket-service.service';
import { AssignmentNews } from '../../interfaces/assignment-news';

@Injectable({
  providedIn: 'root'
})
export class NewsService implements OnDestroy {
  private websocketService = inject(NewsWebsocketServiceService);

  private newsSubject = new BehaviorSubject<AssignmentNews[]>([]);
  public news$ = this.newsSubject.asObservable();

  private subscriptions: Subscription[] = [];

  constructor() {
    this.initializeWebsocket();
  }

  private initializeWebsocket(): void {
    // Connect to the websocket
    this.websocketService.connect();

    // Subscribe to assignment updates
    const updateSub = this.websocketService.assignmentUpdate$.subscribe(
      (assignment: AssignmentNews) => {
        this.upsertNews(assignment);
      }
    );

    // Subscribe to assignment seen events
    const seenSub = this.websocketService.assignmentSeen$.subscribe(
      (assignmentId: number) => {
        // Handle seen updates if needed
        console.log('Assignment seen:', assignmentId);
      }
    );

    this.subscriptions.push(updateSub, seenSub);
  }

  private upsertNews(newsItem: AssignmentNews): void {
    const current = this.newsSubject.getValue();
    const exists = current.some(item => item.id === newsItem.id);
    
    if (exists) {
      // Update existing item
      const updated = current.map(item => 
        item.id === newsItem.id ? newsItem : item
      );
      this.newsSubject.next(updated);
    } else {
      // Add to the beginning of the list
      this.newsSubject.next([newsItem, ...current]);
    }
  }

  deleteNewsItem(id: number): void {
    const current = this.newsSubject.getValue();
    const updated = current.filter(newsItem => newsItem.id !== id);
    this.newsSubject.next(updated);
  }

  deleteAllNewsItems(): void {
    this.newsSubject.next([]);
  }

  getNews(): Observable<AssignmentNews[]> {
    return this.news$;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.websocketService.disconnect();
  }
}
