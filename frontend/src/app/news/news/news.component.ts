import {Component, inject, OnInit} from '@angular/core';
import {News} from '../../interfaces/news';
import {NewsService} from '../news-service/news.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-news',
  imports: [
    NgForOf
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
}
