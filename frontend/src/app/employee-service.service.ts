import {inject, Injectable} from '@angular/core';
import {Employee} from './employee';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmployeeServiceService {
  constructor() {}

  private apiUrl = 'http://localhost:8080/api';
  httpClient: HttpClient = inject(HttpClient);

  getEmployees(): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`${this.apiUrl}/employees`);
  }
}
