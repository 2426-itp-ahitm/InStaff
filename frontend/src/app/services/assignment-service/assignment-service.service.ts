import {inject, Injectable} from '@angular/core';
import {CompanyServiceService} from '../company-service/company-service.service';
import {HttpClient, HttpParams} from '@angular/common/http';
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
  private openAssignmentSubject = new BehaviorSubject<Assignment[]>([]);
  public openAssignments$ = this.openAssignmentSubject.asObservable();

  getAssignmentByShiftId(shiftId: number): Observable<Assignment[]> {
    return this.httpClient.get<Assignment[]>(`${this.getApiUrl()}/assignments/shift/${shiftId}`)
  }

  getAssignments(companyId?: number): void {
    const options = companyId ? { params: this.companyParams(companyId) } : {};
    this.httpClient.get<Assignment[]>(`${this.getApiUrl()}/assignments`, options)
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

  getAssignmentsForEmployee(employeeId: number, companyId?: number): void {
    const options = companyId ? { params: this.companyParams(companyId) } : {};
    this.httpClient.get<Assignment[]>(`${this.getApiUrl()}/assignments/employee/${employeeId}`, options)
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

  confirmAssignment(assignmentId: number, companyId?: number): Observable<any> {
    const url = `${this.getApiUrl()}/assignments/${assignmentId}/confirm/true`;
    const options = companyId ? { params: this.companyParams(companyId) } : {};
    return this.httpClient.put<any>(url, {}, options);
  }

  createAssignment(assignment: AssignmentCreateSingleResponse): Observable<Assignment> {
    return this.httpClient.post<Assignment>(`${this.getApiUrl()}/assignments`, assignment);
  }

  updateAssignment(assignmentId: number, assignment: AssignmentCreateSingleResponse): Observable<Assignment> {
    return this.httpClient.put<Assignment>(`${this.getApiUrl()}/assignments/${assignmentId}`, assignment);
  }

  declineAssignment(assignmentId: number, companyId?: number): Observable<any> {
    const url = `${this.getApiUrl()}/assignments/${assignmentId}/confirm/false`;
    const options = companyId ? { params: this.companyParams(companyId) } : {};
    return this.httpClient.put<any>(url, {}, options);
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

  private companyParams(companyId: number): HttpParams {
    return new HttpParams().set('companyId', companyId);
  }

  getOpenAssignments(): void{
    this.httpClient.get<Assignment[]>(`${this.getApiUrl()}/assignments/openForRequest`)
      .pipe(
        catchError(() => {
          this.openAssignmentSubject.next([]);
          return of([] as Assignment[]);
        })
      )
      .subscribe((ass: Assignment[]) => {
        this.openAssignmentSubject.next(ass)
      })
  }

  requestAssignment(assignmentId: number): Observable<Assignment> {
    return this.httpClient.put<Assignment>(`${this.getApiUrl()}/assignments/${assignmentId}/request`, {})
      .pipe(
        catchError(error => {
          throw error
        })
      )
  }

  withdrawAssignment(assignmentId: number): Observable<Assignment> {
    return this.httpClient.put<Assignment>(`${this.getApiUrl()}/assignments/${assignmentId}/withdrawRequest`, {})
      .pipe(
        catchError(error => {
          throw error
        })
      )
  }

  confirmRequestForAssignment(assignmentId: number, isConfirmed: boolean): Observable<Assignment> {
    return this.httpClient.put<Assignment>(`${this.getApiUrl()}/assignments/${assignmentId}/confirmRequest/${isConfirmed}`, {});
  }
}
