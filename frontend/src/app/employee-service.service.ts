import { switchMap, map } from 'rxjs/operators';
import {inject, Injectable} from '@angular/core';
import {Employee} from './employee';
import {forkJoin, Observable, BehaviorSubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Role} from './role';
import {EmployeeRole} from './employee-role';

@Injectable({
  providedIn: 'root'
})
export class EmployeeServiceService {
  constructor() {}

  private apiUrl = 'http://localhost:8080/api';
  httpClient: HttpClient = inject(HttpClient);

  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  public employees$ = this.employeesSubject.asObservable();

  getEmployees(): void {
    this.httpClient.get<Employee[]>(`${this.apiUrl}/employees`).pipe(
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
    return this.httpClient.get<Role[]>(`${this.apiUrl}/roles`);
  }

  getEnrichedEmployeeById(id: number): Observable<Employee> {
    return this.httpClient.get<Employee>(`${this.apiUrl}/employees/${id}`).pipe(
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
    console.log(transformedEmployee);

    this.httpClient.post<Employee>(`${this.apiUrl}/employees/${updatedEmployee.id}`, transformedEmployee)
      .subscribe((response) => {
        const currentEmployees = this.employeesSubject.getValue();
        const updatedList = currentEmployees.map(emp =>
          emp.id === updatedEmployee.id ? updatedEmployee : emp
        );
        this.employeesSubject.next(updatedList);
      });
  }
}
