import {inject, Injectable} from '@angular/core';
import {CompanyServiceService} from '../company-service/company-service.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Shift} from '../../interfaces/shift';
import {Assignment} from '../../interfaces/assignment';
import {ApiUrlService} from '../api-url/api-url.service';
import {Role} from '../../interfaces/role';
import {AssignmentCreate} from '../../interfaces/assignment-create';

@Injectable({
  providedIn: 'root'
})
export class AssignmentServiceService {
  apiUrl: ApiUrlService = inject(ApiUrlService);
  companyService: CompanyServiceService = inject(CompanyServiceService);
  httpClient: HttpClient = inject(HttpClient);

  private getApiUrl(): string {
    return this.apiUrl.getApiUrl();
  }

  private assignmentSubject = new BehaviorSubject<Assignment[]>([]);
  public assignments$ = this.assignmentSubject.asObservable();
  private assignmentSocket?: WebSocket;
  private assignmentSocketMessageSubject = new Subject<string>();
  public assignmentSocketMessages$ = this.assignmentSocketMessageSubject.asObservable();


  getAssignmentByShiftId(shiftId: number): Observable<Assignment[]> {
    return this.httpClient.get<Assignment[]>(`${this.getApiUrl()}/assignments/shift/${shiftId}`)
  }

  getAssignmentsForEmployee(employeeId: number): void {
    this.httpClient.get<Assignment[]>(`${this.getApiUrl()}/assignments/employee/${employeeId}`)
      .pipe(
        catchError(() => {
          this.assignmentSubject.next([]);
          return of([] as Assignment[]);
        })
      )
      .subscribe((ass: Assignment[]) => {
        this.assignmentSubject.next(ass)
      })
  }

  private getAssignmentsWsUrl(token: string): string {
    const normalizedApiUrl = this.getApiUrl().replace(/\/+$/, '');
    const wsBaseUrl = normalizedApiUrl
      .replace(/^http:/, 'ws:')
      .replace(/^https:/, 'wss:');

    return `${wsBaseUrl}/ws/assignments?token=${encodeURIComponent(token)}`;
  }

  connectAssignmentSocket(token: string): void {
    if (this.assignmentSocket && this.assignmentSocket.readyState !== WebSocket.CLOSED) {
      return;
    }

    this.assignmentSocket = new WebSocket(this.getAssignmentsWsUrl(token));

    this.assignmentSocket.onmessage = (event) => {
      this.assignmentSocketMessageSubject.next(event.data);
    };

    this.assignmentSocket.onerror = (error) => {
      console.error('Assignment WebSocket error:', error);
    };
  }

  disconnectAssignmentSocket(): void {
    if (!this.assignmentSocket) {
      return;
    }
    this.assignmentSocket.close();
    this.assignmentSocket = undefined;
  }


  assignShiftForEmployee(employeeId: number, shiftId: number, roleId: number, confirmed: boolean): Observable<any> {
    const url = `${this.getApiUrl()}/employees/${employeeId}/assignshift/${shiftId}/${roleId}`;
    return this.httpClient.put<any>(url, { confirmed });
  }


  confirmAssignment(assignmentId: number): Observable<any> {
    const url = `${this.getApiUrl()}/assignments/${assignmentId}/confirm/true`;
    return this.httpClient.put<any>(url, {});
  }

  createAssignment(assignment: AssignmentCreate): Observable<Assignment> {
    return this.httpClient.post<Assignment>(`${this.getApiUrl()}/assignments`, assignment);
  }

  declineAssignment(assignmentId: number): Observable<any> {
    const url = `${this.getApiUrl()}/assignments/${assignmentId}/confirm/false`;
    return this.httpClient.put<any>(url, {});
  }
}
