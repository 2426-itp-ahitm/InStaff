import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Role} from '../../interfaces/role';
import {BehaviorSubject, Observable} from 'rxjs';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {Employee} from '../../interfaces/employee';
import {FeedbackServiceService} from '../../feedback/feedback-service/feedback-service.service';

@Injectable({
  providedIn: 'root'
})
export class RoleServiceService {
  companyService: CompanyServiceService = inject(CompanyServiceService);
  httpClient: HttpClient = inject(HttpClient);
  feedbackService: FeedbackServiceService = inject(FeedbackServiceService)



  private rolesSubject = new BehaviorSubject<Role[]>([]);
  public roles$ = this.rolesSubject.asObservable();

  private oldApiUrl = 'http://localhost:8080/api';

  private getApiUrl(): string {
    return `http://localhost:8080/api/${this.companyService.getCompanyId()}`;
    //return this.oldApiUrl
  }

  getRoles(): void {
    this.httpClient.get<Role[]>(`${this.getApiUrl()}/roles`)
      .subscribe((roles: Role[]) => {
        console.log(roles);
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
      this.feedbackService.newFeedback({message:"Role successfully added", type: 'success', showFeedback: true})

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
        this.feedbackService.newFeedback({message:"Role successfully updated", type: 'success', showFeedback: true})

      });
  }

  getRoleNameById(id: number):String {
    let returnValue = "Something is wrong in Role-Service, check if getRoles() is executed";
    let roles = this.rolesSubject.getValue();
    for (let i = 0; i < roles.length; i++) {
      if (roles[i].id == id) {
        returnValue = roles[i].roleName
      }
    }
    return returnValue;
  }

  deleteRole(id: number): void {
    this.httpClient.delete<Role>(`${this.getApiUrl()}/roles/remove/${id}`)
      .subscribe((response) => {
        const currentRoles = this.rolesSubject.getValue();
        const updatedRoles = currentRoles.filter(r => r.id !== id);
        this.rolesSubject.next(updatedRoles);
        this.feedbackService.newFeedback({message:"Role successfully deleted", type: 'error', showFeedback: true})

      });
  }
}
