import {Component, inject, OnInit, Output, EventEmitter} from '@angular/core';
import {News} from '../../interfaces/news';
import {NewsService} from '../news-service/news.service';
import {NgForOf, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-news',
  imports: [
    NgForOf,
    NgOptimizedImage
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent implements OnInit {
  newsService: NewsService = inject(NewsService);

  news: News[] = []
  ngOnInit() {
    this.newsService.news$.subscribe((data) => {
      this.news = data;
    })
    this.newsService.getNews()
  }

  dateToString(shift_date: Date) {

    return new Date(shift_date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  openShiftEditWithId(shift_id: number) {
    this.shiftSelected.emit(shift_id);
  }

  @Output() shiftSelected: EventEmitter<number> = new EventEmitter<number>();

  deleteNewsItem(n: News) {
    if (!n) return;
    this.newsService.deleteNewsItem(n.shift_id);
  }
}
