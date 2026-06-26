import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CompanyInvite} from '../../interfaces/company-invite';
import {BehaviorSubject, Observable} from 'rxjs';
import {CompanyInviteResponse} from '../../interfaces/company-invite-response';
import {environment} from '../../../environments/environment';
import {CompanyListDto} from '../../interfaces/company-list-dto';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  httpClient: HttpClient = inject(HttpClient);

  private companyInvitesListSubject = new BehaviorSubject<CompanyListDto[]>([]);
  public companyInviteList$ = this.companyInvitesListSubject.asObservable();

  getAllCompanyInvites(): void {
    this.httpClient.get<CompanyListDto[]>(`${environment.apiUrl}/admin/company-setup/invites`).subscribe(invites => this.companyInvitesListSubject.next(invites));
  }

  addNewCompanyInvite(companyInvite: CompanyInvite): Observable<CompanyInviteResponse> {
    return this.httpClient.post<CompanyInviteResponse>(`${environment.apiUrl}/admin/company-setup/invites`, companyInvite);
  }


}
