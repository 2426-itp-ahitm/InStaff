import {Component, inject, OnInit, Output, EventEmitter} from '@angular/core';
import {News} from '../../interfaces/news';
import {NewsService} from '../news-service/news.service';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {NewsWebsocketServiceService} from '../news-websocket-serivce/news-websocket-service.service';

@Component({
  selector: 'app-news',
  imports: [
    NgForOf,
    NgOptimizedImage,
    NgIf
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css'
})
export class NewsComponent implements OnInit {
  message: string = '';

  constructor(private ws: NewsWebsocketServiceService) {}



  newsService: NewsService = inject(NewsService);

  news: News[] = []
  ngOnInit() {
    this.newsService.news$.subscribe((data) => {
      this.news = data;
    })
    this.newsService.getNews()

    this.ws.connect("ws://localhost:8080/api/ws/news")
      .subscribe(msg => {
        console.log("Received:", msg);
        this.message = msg;
      });
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

  deleteNewsItem(id:number) {
    this.newsService.deleteNewsItem(id)
  }

   deleteAllNewsItems() {
     this.newsService.deleteAllNewsItem()

   }
}
