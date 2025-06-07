import {inject, Injectable} from '@angular/core';
import {ShiftTemplate} from '../interfaces/shift-template';
import {HttpClient} from '@angular/common/http';
import {CompanyServiceService} from '../company-service/company-service.service';
import {BehaviorSubject} from 'rxjs';
import {Shift} from '../interfaces/shift';
import {ShiftCreateDTO} from '../interfaces/new-shift';
import {Role} from '../interfaces/role';

@Injectable({
  providedIn: 'root'
})
export class ShiftTemplateServiceService {
  companyService: CompanyServiceService = inject(CompanyServiceService);
  httpClient: HttpClient = inject(HttpClient);

  public selectedDate!: ShiftCreateDTO;

  private shiftTemplatesSubject = new BehaviorSubject<ShiftTemplate[]>([]);
  public shiftTemplates$ = this.shiftTemplatesSubject.asObservable();

  private getApiUrl(): string {
    return `http://localhost:8080/api/${this.companyService.getCompanyId()}`
    //return this.oldApiUrl;
  }

  getShiftTemplates(): void {
    this.httpClient.get<ShiftTemplate[]>(`${this.getApiUrl()}/shift-templates`)
      .subscribe((shiftTemplates: ShiftTemplate[]) => {
        this.shiftTemplatesSubject.next(shiftTemplates);
      });
  }

  deleteShiftTemplate(id: number) {
    this.httpClient.delete<ShiftTemplate>(`${this.getApiUrl()}/shift-templates/delete/${id}`)
      .subscribe((response) => {
        const currentShifts = this.shiftTemplatesSubject.getValue();
        const updatedShifts = currentShifts.filter(sT => sT.id !== id);
        this.shiftTemplatesSubject.next(updatedShifts);
      });
  }

  updateShiftTemplate(updatedShiftTemplate: ShiftTemplate) {

  }
}
