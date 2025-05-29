import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Role} from '../interfaces/role';
import {BehaviorSubject, Observable} from 'rxjs';
import {CompanyServiceService} from '../company-service/company-service.service';
import {Employee} from '../interfaces/employee';

@Injectable({
  providedIn: 'root'
})
export class RoleServiceService {
  constructor(private companyService: CompanyServiceService) { }

  httpClient: HttpClient = inject(HttpClient);


  private rolesSubject = new BehaviorSubject<Role[]>([]);
  public roles$ = this.rolesSubject.asObservable();

  private oldApiUrl = 'http://localhost:8080/api';

  private getApiUrl(): string {
    return `http://localhost:8080/api/${this.companyService.getCompanyId()}`;
    //return this.oldApiUrl
  }

  getRoles(): void {
    this.httpClient.get<Role[]>(`${this.getApiUrl()}/roles`).subscribe((roles: Role[]) => {
      this.rolesSubject.next(roles);
    });
  }

  addRole(newRoleName: string): void {
    this.httpClient.post<Role>(`${this.getApiUrl()}/roles`, {
      companyId: 1,
      roleName: newRoleName
    }).subscribe(createdRole => {
      const currentRoles = this.rolesSubject.getValue();
      this.rolesSubject.next([...currentRoles, createdRole]);
    });
  }
  updateRole(updatedRole: Role): void {

    this.httpClient.post<Role>(`${this.getApiUrl()}/roles/${updatedRole.id}`, updatedRole)
      .subscribe((response) => {
        const currentRoles = this.rolesSubject.getValue();
        const updatedList = currentRoles.map(role =>
          role.id === updatedRole.id ? updatedRole : role
        );
        this.rolesSubject.next(updatedList);
      });
  }
}
