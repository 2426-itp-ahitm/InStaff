import { switchMap, map } from 'rxjs/operators';
import {inject, Injectable} from '@angular/core';
import {Employee} from '../../interfaces/employee';
import {forkJoin, Observable, BehaviorSubject} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Role} from '../../interfaces/role';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {ApiUrlService} from '../../services/api-url/api-url.service';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {EmployeeCreate} from '../../interfaces/employee-create';

@Injectable({
  providedIn: 'root'
})
export class EmployeeServiceService {
  constructor(private companyService: CompanyServiceService) {}

  httpClient: HttpClient = inject(HttpClient);
  apiUrl: ApiUrlService = inject(ApiUrlService);

  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  public employees$ = this.employeesSubject.asObservable();

  private getEmployeeApiUrl(): string {
    return `${this.apiUrl.getApiUrl()}/employees`;
  }

  /* GET */

  getAllEmployees(): void{
    this.httpClient.get<Employee[]>(`${this.getEmployeeApiUrl()}`).subscribe(employees => this.employeesSubject.next(employees));
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
    return this.httpClient.get<Employee[]>(`${this.getEmployeeApiUrl()}/role/${roleId}`)
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

  deleteEmployee(id: number): Observable<HttpResponse<Employee>> {
    return this.httpClient.delete<Employee>(
      `${this.getEmployeeApiUrl()}/${id}`,
      { observe: 'response' }
    );
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
