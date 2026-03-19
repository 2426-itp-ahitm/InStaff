import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {BehaviorSubject} from 'rxjs';
import {FeedbackServiceService} from '../../feedback/feedback-service/feedback-service.service';
import {ApiUrlService} from '../../services/api-url/api-url.service';
import {ShiftCreate} from '../../interfaces/shift-create';
import {Shifttemplate} from '../../interfaces/shifttemplate';

@Injectable({
  providedIn: 'root'
})
export class ShiftTemplateServiceService {
  companyService: CompanyServiceService = inject(CompanyServiceService);
  httpClient: HttpClient = inject(HttpClient);
  feedbackService: FeedbackServiceService = inject(FeedbackServiceService)
  apiUrl: ApiUrlService = inject(ApiUrlService);

  public selectedDate!: ShiftCreate;

  private shiftTemplatesSubject = new BehaviorSubject<Shifttemplate[]>([]);
  public shiftTemplates$ = this.shiftTemplatesSubject.asObservable();

  private getApiUrl(): string {
    return this.apiUrl.getApiUrl();
  }

  getShiftTemplates(): void {
    this.httpClient.get<Shifttemplate[]>(`${this.getApiUrl()}/shift-templates`)
      .subscribe((shiftTemplates: Shifttemplate[]) => {
        this.shiftTemplatesSubject.next(shiftTemplates);
      });
  }

  deleteShiftTemplate(id: number) {
    this.httpClient.delete<Shifttemplate>(`${this.getApiUrl()}/shift-templates/delete/${id}`)
      .subscribe((response) => {
        const currentShifts = this.shiftTemplatesSubject.getValue();
        const updatedShifts = currentShifts.filter(sT => sT.id !== id);
        this.shiftTemplatesSubject.next(updatedShifts);
        this.feedbackService.newFeedback({message:"Schicht Vorlage erfolgreich gelöscht", type: 'success', showFeedback: true})
      });
  }

  updateShiftTemplate(updatedShiftTemplate: Shifttemplate) {
    this.httpClient.put<Shifttemplate>(`${this.getApiUrl()}/shift-templates/`, updatedShiftTemplate)
      .subscribe((response) => {
        const currentShiftTemplates = this.shiftTemplatesSubject.getValue();
        const updatedShiftTemplatesList = currentShiftTemplates.map(sT =>
          sT.id === updatedShiftTemplate.id ? updatedShiftTemplate : sT
        );
        this.shiftTemplatesSubject.next(updatedShiftTemplatesList);
        this.feedbackService.newFeedback({message:"Schicht Vorlage erfolgreich bearbeitet", type: 'success', showFeedback: true})
      });
  }

  addShiftTemplate(newShiftTemplate: Shifttemplate) {
    this.httpClient.post<Shifttemplate>(`${this.getApiUrl()}/shift-templates`, newShiftTemplate)
      .subscribe(() => {
        // Reload from backend so the newly created template is emitted with complete fields.
        this.getShiftTemplates();
        this.feedbackService.newFeedback({message:"Schicht Vorlage erfolgreich hinzugefügt", type: 'success', showFeedback: true})
    });
  }
}
