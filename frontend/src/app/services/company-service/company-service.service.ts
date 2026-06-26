import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CompanyOverview} from '../../interfaces/company-overview';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyServiceService {

  constructor() { }

  httpClient: HttpClient = inject(HttpClient);

  private companyId: number = 1;
  public isDataLoaded: boolean = false;
  defaultStartingHour: number = 12;
  defaultEndingHour: number = 18;


  getCompanyId():number {
    return this.companyId;
  }

  setCompanyId(id:number) {
    this.companyId = id;
  }

  getDefaultStartingHour(){
    return this.defaultStartingHour
  }

  getDefaultEndingHour(){
    return this.defaultEndingHour;
  }

  getAllCompanies(): Observable<CompanyOverview[]> {
    return this.httpClient.get<CompanyOverview[]>(`${environment.apiUrl}/companies/all`);
  }


}
