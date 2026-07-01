import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {
  CompanySetupComplete,
  CompanySetupSession,
  CompanySetupTokenValidation
} from '../../interfaces/company-setup';
import {CompanyListDto} from '../../interfaces/company-list-dto';

@Injectable({
  providedIn: 'root'
})
export class CompanySetupService {
  private httpClient: HttpClient = inject(HttpClient);

  validateToken(token: string): Observable<CompanySetupTokenValidation> {
    return this.httpClient.get<CompanySetupTokenValidation>(`${environment.apiUrl}/company-setup/${token}`);
  }

  login(token: string, password: string): Observable<CompanySetupSession> {
    return this.httpClient.post<CompanySetupSession>(`${environment.apiUrl}/company-setup/${token}/login`, {password});
  }

  completeSetup(setupSessionToken: string, setup: CompanySetupComplete): Observable<CompanyListDto> {
    const headers = new HttpHeaders().set('X-Setup-Session', setupSessionToken);
    return this.httpClient.post<CompanyListDto>(`${environment.apiUrl}/company-setup/company`, setup, {headers});
  }
}
