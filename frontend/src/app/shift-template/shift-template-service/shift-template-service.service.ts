import {inject, Injectable} from '@angular/core';
import {ShiftTemplate} from '../../interfaces/shift-template';
import {HttpClient} from '@angular/common/http';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {BehaviorSubject} from 'rxjs';
import {Shift} from '../../interfaces/shift';
import {ShiftCreateDTO} from '../../interfaces/new-shift';
import {Role} from '../../interfaces/role';
import {FeedbackServiceService} from '../../feedback/feedback-service/feedback-service.service';
import {ApiUrlService} from '../../services/api-url/api-url.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftTemplateServiceService {
  companyService: CompanyServiceService = inject(CompanyServiceService);
  httpClient: HttpClient = inject(HttpClient);
  feedbackService: FeedbackServiceService = inject(FeedbackServiceService)
  apiUrl: ApiUrlService = inject(ApiUrlService);

  public selectedDate!: ShiftCreateDTO;

  private shiftTemplatesSubject = new BehaviorSubject<ShiftTemplate[]>([]);
  public shiftTemplates$ = this.shiftTemplatesSubject.asObservable();

  private getApiUrl(): string {
    return this.apiUrl.getApiUrl();
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
        this.feedbackService.newFeedback({message:"Shift Template successfully deleted", type: 'error', showFeedback: true})
      });
  }

  updateShiftTemplate(updatedShiftTemplate: ShiftTemplate) {
    this.httpClient.put<ShiftTemplate>(`${this.getApiUrl()}/shift-templates/`, updatedShiftTemplate)
      .subscribe((response) => {
        const currentShiftTemplates = this.shiftTemplatesSubject.getValue();
        const updatedShiftTemplatesList = currentShiftTemplates.map(sT =>
          sT.id === updatedShiftTemplate.id ? updatedShiftTemplate : sT
        );
        this.shiftTemplatesSubject.next(updatedShiftTemplatesList);
        this.feedbackService.newFeedback({message:"Shift Template successfully updated", type: 'success', showFeedback: true})
      });
  }

  addShiftTemplate(newShiftTemplate: ShiftTemplate) {
    this.httpClient.post<ShiftTemplate>(`${this.getApiUrl()}/shift-templates`, newShiftTemplate)
      .subscribe(createdShiftTemplate => {
        console.log(createdShiftTemplate);
        const currentShiftTemplates = this.shiftTemplatesSubject.getValue();
        this.shiftTemplatesSubject.next([...currentShiftTemplates, createdShiftTemplate]);
        this.feedbackService.newFeedback({message:"Shift Template successfully added", type: 'success', showFeedback: true})
    });
  }
}
