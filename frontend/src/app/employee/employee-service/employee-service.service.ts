import {switchMap, map, catchError} from 'rxjs/operators';
import {inject, Injectable} from '@angular/core';
import {Employee} from '../../interfaces/employee';
import {forkJoin, Observable, BehaviorSubject, throwError, of} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpParams, HttpResponse} from '@angular/common/http';
import {Role} from '../../interfaces/role';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {ApiUrlService} from '../../services/api-url/api-url.service';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {EmployeeCreate} from '../../interfaces/employee-create';
import {Shifttemplate} from '../../interfaces/shifttemplate';
import {FeedbackServiceService} from '../../feedback/feedback-service/feedback-service.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeServiceService {
  constructor(private companyService: CompanyServiceService) {}

  httpClient: HttpClient = inject(HttpClient);
  apiUrl: ApiUrlService = inject(ApiUrlService);
  feedbackService: FeedbackServiceService = inject(FeedbackServiceService);

  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  public employees$ = this.employeesSubject.asObservable();

  private getEmployeeApiUrl(): string {
    return `${this.apiUrl.getApiUrl()}/employees`;
  }

  /* GET */

  getAllEmployees(companyId?: number): void{
    const options = companyId ? { params: new HttpParams().set('companyId', companyId) } : {};
    this.httpClient.get<Employee[]>(`${this.getEmployeeApiUrl()}`, options).subscribe(employees => this.employeesSubject.next(employees));
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.getEmployeeApiUrl()}/${id}`)
  }

  getEmployeeByKeykloackId(keykloackId: string): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.getEmployeeApiUrl()}/keycloak/${keykloackId}`)
  }

  getEmployeeByName(name: string): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.getEmployeeApiUrl()}/name/${name}`)
  }

  getAllEmployeesByRoleId(roleId: number): Observable<Employee[]> {
    return this.httpClient.get<Employee[]>(`${this.getEmployeeApiUrl()}/role/${roleId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of([]);
        }
        return throwError(() => error);
      })
    );
  }


  /* POST */

  createEmployee(newEmployee: EmployeeCreate): Observable<Employee> {
    return this.httpClient.post<Employee>(`${this.getEmployeeApiUrl()}`, newEmployee)
  }


  /* PUT */

  updateEmployee(empId: number, newEmployee: EmployeeCreate): Observable<Employee> {
    console.log(newEmployee);
    return this.httpClient.put<Employee>(`${this.getEmployeeApiUrl()}/${empId}`, newEmployee)
  }

  addRoleToEmployee(empId: number, roleId: number): Observable<Employee> {
    return this.httpClient.put<Employee>(`${this.getEmployeeApiUrl()}/${empId}/assignrole/${roleId}`, {})
  }

  removeRoleFromEmployee(empId: number, roleId: number): Observable<Employee> {
    return this.httpClient.put<Employee>(`${this.getEmployeeApiUrl()}/${empId}/removerole/${roleId}`, {})
  }


  /* DELETE */

  deleteEmployee(id: number):boolean{
    let deleteSucceeded = true;
    this.httpClient.delete<Employee>(`${this.getEmployeeApiUrl()}/${id}`)
      .subscribe((response) => {
        const currentEmps = this.employeesSubject.getValue();
        const updatedEmps = currentEmps.filter(e => e.id !== id);
        this.employeesSubject.next(updatedEmps);
        this.feedbackService.newFeedback({message:"Mitarbeiter erfolgreich gelöscht", type: 'success', showFeedback: true})
      });
    return deleteSucceeded;

  }




  birthdateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const birthdate = new Date(control.value);
      if (Number.isNaN(birthdate.getTime())) {
        return {invalidBirthdate: true};
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      birthdate.setHours(0, 0, 0, 0);

      if (birthdate > today) {
        return {futureBirthdate: true};
      }

      return null;
    };
  }


}
