import {inject, Injectable} from '@angular/core';
import {CompanyServiceService} from '../company-service/company-service.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
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


  getAssignmentByShiftId(shiftId: number): Observable<Assignment[]> {
    return this.httpClient.get<Assignment[]>(`${this.getApiUrl()}/assignments/shift/${shiftId}`)
  }

  getAssignmentsForEmployee(employeeId: number): void {
    this.httpClient.get<Assignment[]>(`${this.getApiUrl()}/assignments/employee/${employeeId}`)
      .subscribe((ass: Assignment[]) => {
        this.assignmentSubject.next(ass)
      })
  }


  assignShiftForEmployee(employeeId: number, shiftId: number, roleId: number, confirmed: boolean): Observable<any> {
    const url = `${this.getApiUrl()}/employees/${employeeId}/assignshift/${shiftId}/${roleId}`;
    return this.httpClient.put<any>(url, { confirmed });
  }


  confirmAssignment(assignmentId: number): Observable<any> {
    const url = `${this.getApiUrl()}/confirmation/confirm/${assignmentId}`;
    return this.httpClient.put<any>(url, {});
  }

  createAssignment(assignment: AssignmentCreate): Observable<Assignment> {
    return this.httpClient.post<Assignment>(`${this.getApiUrl()}/assignments`, assignment);
  }

  declineAssignment(assignmentId: number): Observable<any> {
    const url = `${this.getApiUrl()}/confirmation/decline/${assignmentId}`;
    return this.httpClient.put<any>(url, {});
  }
}
