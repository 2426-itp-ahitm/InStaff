import {inject, Injectable} from '@angular/core';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {Employee} from '../../interfaces/employee';
import {News} from '../../interfaces/news';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(private companyService: CompanyServiceService) {}

  httpClient: HttpClient = inject(HttpClient);

  private newsSubject = new BehaviorSubject<News[]>([]);
  public news$ = this.newsSubject.asObservable();

  private getApiUrl(): string {
    return `http://localhost:8080/api/${this.companyService.getCompanyId()}`;
    //return this.oldApiUrl;
  }

  getNews() {
    this.httpClient.get<News[]>(`${this.getApiUrl()}/news`).subscribe((news: News[]) => {
      this.newsSubject.next(news);
    });
  }

}
