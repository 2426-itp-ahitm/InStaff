import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoleServiceService {
  constructor() { }

  private apiUrl = 'http://localhost:8080/api';
  httpClient: HttpClient = inject(HttpClient);

  addRole(newRoleName: string): void {
    this.httpClient.post(`${this.apiUrl}/roles`, {
      companyId: 1,
      roleName: newRoleName
    }).subscribe();
  }
}
