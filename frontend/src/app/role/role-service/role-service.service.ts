import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Role} from '../../interfaces/role';
import {BehaviorSubject, Observable} from 'rxjs';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {Employee} from '../../interfaces/employee';
import {FeedbackServiceService} from '../../feedback/feedback-service/feedback-service.service';
import {ApiUrlService} from '../../services/api-url/api-url.service';
import {RoleCreate} from '../../interfaces/role-create';

@Injectable({
  providedIn: 'root'
})
export class RoleServiceService {
  companyService: CompanyServiceService = inject(CompanyServiceService);
  httpClient: HttpClient = inject(HttpClient);
  feedbackService: FeedbackServiceService = inject(FeedbackServiceService)

  apiUrl: ApiUrlService = inject(ApiUrlService);

  private rolesSubject = new BehaviorSubject<Role[]>([]);
  public roles$ = this.rolesSubject.asObservable();

  private getApiUrl(): string {
    return this.apiUrl.getApiUrl();
  }

  getRoles(): void {
    this.httpClient.get<Role[]>(`${this.getApiUrl()}/roles`)
      .subscribe((roles: Role[]) => {
      this.rolesSubject.next(roles);
    });
  }

  addRole(newRoleName: string, newDescription: string): void {
    this.httpClient.post<Role>(`${this.getApiUrl()}/roles`, {
      companyId: 1,
      roleName: newRoleName,
      description: newDescription
    }).subscribe(createdRole => {
      const currentRoles = this.rolesSubject.getValue();
      this.rolesSubject.next([...currentRoles, createdRole]);
      this.feedbackService.newFeedback({message:"Rolle erfolgreich hinzugefügt", type: 'success', showFeedback: true})

    });
  }
  updateRole(updatedRole: RoleCreate, roleId: number): void {
    this.httpClient.put<Role>(`${this.getApiUrl()}/roles/${roleId}`, updatedRole ).subscribe((r) => {
        let currentRoles = this.rolesSubject.getValue();
        currentRoles = currentRoles.filter(role => role.id != r.id);
        console.log(currentRoles);
        this.rolesSubject.next([...currentRoles, r]);
        this.feedbackService.newFeedback({message:"Rolle erfolgreich bearbeitet", type: 'success', showFeedback: true})

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

  deleteRole(id: number): boolean {
    let deletedSucceeded = true
    this.httpClient.delete<Role>(`${this.getApiUrl()}/roles/${id}`)
      .subscribe((response) => {
        const currentRoles = this.rolesSubject.getValue();
        const updatedRoles = currentRoles.filter(r => r.id !== id);
        this.rolesSubject.next(updatedRoles);
        this.feedbackService.newFeedback({message:"Rolle erfolgreich gelöscht", type: 'success', showFeedback: true})

      });
    return deletedSucceeded;
  }

  getRoleById(id: number): Role {
    const roles = this.rolesSubject.getValue()
    const role = roles.find(r => r.id === id)

    if (!role) {
      throw new Error('Role not found. Make sure getRoles() was executed.')
    }

    return role
  }
}
