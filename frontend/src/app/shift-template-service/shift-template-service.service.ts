import {inject, Injectable} from '@angular/core';
import {ShiftTemplate} from '../interfaces/shift-template';
import {HttpClient} from '@angular/common/http';
import {CompanyServiceService} from '../company-service/company-service.service';
import {BehaviorSubject} from 'rxjs';
import {NewShift, Shift} from '../interfaces/shift';

@Injectable({
  providedIn: 'root'
})
export class ShiftTemplateServiceService {
  companyService: CompanyServiceService = inject(CompanyServiceService);
  httpClient: HttpClient = inject(HttpClient);

  public selectedDate!: NewShift;

  private shiftTemplatesSubject = new BehaviorSubject<ShiftTemplate[]>([]);
  public shiftTemplates$ = this.shiftTemplatesSubject.asObservable();

  private oldApiUrl = 'http://localhost:8080/api';
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
}
