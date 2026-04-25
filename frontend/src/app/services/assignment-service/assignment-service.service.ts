import {inject, Injectable} from '@angular/core';
import {CompanyServiceService} from '../company-service/company-service.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Assignment} from '../../interfaces/assignment';
import {ApiUrlService} from '../api-url/api-url.service';
import {AssignmentCreate} from '../../interfaces/assignment-create';
import {AssignmentCreateSingleResponse} from '../../interfaces/assignment-create-single';

@Injectable({
  providedIn: 'root'
})
export class AssignmentServiceService {
  apiUrl: ApiUrlService = inject(ApiUrlService);
  companyService: CompanyServiceService = inject(CompanyServiceService);
  httpClient: HttpClient = inject(HttpClient);
  private assignmentSubject = new BehaviorSubject<Assignment[]>([]);
  public assignments$ = this.assignmentSubject.asObservable();

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

  assignShiftForEmployee(employeeId: number, shiftId: number, roleId: number, confirmed: boolean): Observable<any> {
    const url = `${this.getApiUrl()}/employees/${employeeId}/assignshift/${shiftId}/${roleId}`;
    return this.httpClient.put<any>(url, {confirmed});
  }

  confirmAssignment(assignmentId: number): Observable<any> {
    const url = `${this.getApiUrl()}/assignments/${assignmentId}/confirm/true`;
    return this.httpClient.put<any>(url, {});
  }

  createAssignment(assignment: AssignmentCreateSingleResponse): Observable<Assignment> {
    return this.httpClient.post<Assignment>(`${this.getApiUrl()}/assignments`, assignment);
  }

  updateAssignment(assignmentId: number, assignment: AssignmentCreateSingleResponse): Observable<Assignment> {
    return this.httpClient.put<Assignment>(`${this.getApiUrl()}/assignments/${assignmentId}`, assignment);
  }

  declineAssignment(assignmentId: number): Observable<any> {
    const url = `${this.getApiUrl()}/assignments/${assignmentId}/confirm/false`;
    return this.httpClient.put<any>(url, {});
  }

  deleteAssignment(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.getApiUrl()}/assignments/${id}`);
  }

  getAssignmentById(assignmentId: number): Observable<Assignment> {
    return this.httpClient.get<Assignment>(`${this.getApiUrl()}/assignments/${assignmentId}`)
  }

  private getApiUrl(): string {
    return this.apiUrl.getApiUrl();
  }
}
