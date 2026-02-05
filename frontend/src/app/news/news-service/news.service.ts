import {inject, Injectable} from '@angular/core';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {Employee} from '../../interfaces/employee';
import {News} from '../../interfaces/news';
import {ApiUrlService} from '../../services/api-url/api-url.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(private companyService: CompanyServiceService) {}

  httpClient: HttpClient = inject(HttpClient);
  apiUrl: ApiUrlService = new ApiUrlService();

  private newsSubject = new BehaviorSubject<News[]>([]);
  public news$ = this.newsSubject.asObservable();

  private getApiUrl(): string {
    return this.apiUrl.getApiUrl();
  }

  getNews() {
    this.httpClient.get<News[]>(`${this.getApiUrl()}/news`).subscribe((listOfNews: News[]) => {
      this.newsSubject.next(listOfNews);
    });
  }

  deleteNewsItem(id: number) {
    this.httpClient.delete(`${this.getApiUrl()}/news/${id}`).subscribe({
      next: () => {
        this.getNews();
      }
    })
  }

  recievedDeleteNewsItem(id: number) {
    if(id == -1) {
      this.newsSubject.next([]);
      return;
    }else {
      const current = this.newsSubject.getValue();
      const updated = current.filter(newsItem => newsItem.id !== id);
      this.newsSubject.next(updated);
    }
  }

  deleteAllNewsItem() {
    this.httpClient.delete(`${this.getApiUrl()}/news/-1`).subscribe({
      next: () => {
        this.getNews();
      }
    })
  }

  addNews(msg: string) {
    const raw = JSON.parse(msg);
    const news: News = {
      ...raw
    }
    const current = this.newsSubject.getValue();
    this.newsSubject.next([news, ...current]);
  }



}
