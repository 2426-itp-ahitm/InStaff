import { switchMap, map } from 'rxjs/operators';
import {inject, Injectable} from '@angular/core';
import {Employee} from '../../interfaces/employee';
import {forkJoin, Observable, BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Role} from '../../interfaces/role';
import {EmployeeRole} from '../../interfaces/employee-role';
import {NewEmployee} from '../../interfaces/new-employee';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {ApiUrlService} from '../../services/api-url/api-url.service';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class EmployeeServiceService {
  constructor(private companyService: CompanyServiceService) {}

  httpClient: HttpClient = inject(HttpClient);
  apiUrl: ApiUrlService = inject(ApiUrlService);

  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  public employees$ = this.employeesSubject.asObservable();

  private getApiUrl(): string {
    return this.apiUrl.getApiUrl();
  }

  getEmployees(): void {
    this.httpClient.get<Employee[]>(`${this.getApiUrl()}/employees/`).pipe(
      switchMap((employees: Employee[]) => {
        const enrichedEmployeeObservables = employees.map(emp =>
          this.getEnrichedEmployeeById(emp.id)
        );
        return forkJoin(enrichedEmployeeObservables);
      })
    ).subscribe((enrichedEmployees: Employee[]) => {
      this.employeesSubject.next(enrichedEmployees);
    });
  }

  getRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(`${this.getApiUrl()}/roles`);
  }

  getEmployeeById(id: number): Employee{
    let emps: Employee[] = [];
    this.employees$.subscribe((data) => {
      emps = data;
    });

    if(emps.find(emp => emp.id === id) != null){
      return emps.find(emp => emp.id === id)!;
    }else{
      return emps[0]
    }
  }

  getEmployeeByKeycloakId(keycloakId: string): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.getApiUrl()}/employees/keycloak/${keycloakId}`);
  }

  getEnrichedEmployeeById(id: number): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.getApiUrl()}/employees/${id}`).pipe(
      switchMap((employee: any) => {
        return this.getRoles().pipe(
          map((allRoles: Role[]) => {
            const enrichedRoles: EmployeeRole[] = allRoles.map(role => ({
              roleId: role.id,
              name: role.roleName,
              hasRole: (employee.roles ?? []).includes(role.id)
            }));
            return {
              ...employee,
              roles: enrichedRoles
            };
          })
        );
      })
    );
  }


  updateEmployee(updatedEmployee: Employee): void {
    const transformedEmployee = {
      ...updatedEmployee,
      roles: updatedEmployee.roles
        .filter(role => role.hasRole)
        .map(role => role.roleId)
    };


    this.httpClient.post<Employee>(`${this.getApiUrl()}/employees/${transformedEmployee.id}`, transformedEmployee)
      .subscribe((response) => {
        const currentEmployees = this.employeesSubject.getValue();
        const updatedList = currentEmployees.map(emp =>
          emp.id === updatedEmployee.id ? updatedEmployee : emp
        );
        this.employeesSubject.next(updatedList);
      });
  }

  addNewEmployee(newEmployee: NewEmployee): void {
    this.httpClient.post<Employee>(`${this.getApiUrl()}/employees`, newEmployee)
      .subscribe(() => {
        // Reload enriched data so roles are available immediately in the list.
        this.getEmployees();
      });
  }

  deleteEmployee(id: number): void {
    this.httpClient.delete<Employee>(`${this.getApiUrl()}/employees/delete/${id}`)
    .subscribe((response) => {
      const currentEmployees = this.employeesSubject.getValue();
      const updatedEmployees = currentEmployees.filter(emp => emp.id !== id);
      this.employeesSubject.next(updatedEmployees);
    });
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
