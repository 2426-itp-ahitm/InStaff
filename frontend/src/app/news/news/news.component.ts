import { Component, inject, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NewsService } from '../news-service/news.service';
import { NgOptimizedImage } from '@angular/common';
import { DateService } from '../../services/date-service/date.service';
import { Subscription } from 'rxjs';
import { AssignmentNews } from '../../interfaces/assignment-news';

@Component({
  selector: 'app-news',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent implements OnInit, OnDestroy {
  private newsService = inject(NewsService);
  private dateService = inject(DateService);

  @Output() shiftSelected = new EventEmitter<number>();

  news: AssignmentNews[] = [];
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    const newsSub = this.newsService.getNews().subscribe(items => {
      this.news = items;
    });
    this.subscriptions.push(newsSub);
  }

  deleteNewsItem(id: number): void {
    this.newsService.deleteNewsItem(id);
  }

  deleteAllNewsItems(): void {
    this.newsService.deleteAllNewsItems();
  }

  openShiftEditWithId(shiftId?: number): void {
    if (!shiftId) {
      return;
    }
    this.shiftSelected.emit(shiftId);
  }

  dateToString(dateString?: string): string {
    if (!dateString) {
      return '-';
    }

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    try {
      return this.dateService.dateToString(date);
    } catch {
      return '-';
    }
  }

  getEmployeeName(news: AssignmentNews): string {
    if (!news.employee) {
      return 'Mitarbeiter';
    }

    const first = news.employee.firstname ?? '';
    const last = news.employee.lastname ?? '';
    const name = `${first} ${last}`.trim();
    return name.length > 0 ? name : 'Mitarbeiter';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
