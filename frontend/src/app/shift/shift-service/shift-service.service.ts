import {inject, Injectable} from '@angular/core';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, forkJoin, Observable} from 'rxjs';
import {Employee} from '../../interfaces/employee';
import {Shift} from '../../interfaces/shift';
import {tap} from 'rxjs/operators';
import {DateClickArg} from '@fullcalendar/interaction';
import {ShiftTemplate} from '../../interfaces/shift-template';
import {NewShift, ShiftCreateDTO} from '../../interfaces/new-shift';
import {FeedbackServiceService} from '../../feedback/feedback-service/feedback-service.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftServiceService {
  companyService: CompanyServiceService = inject(CompanyServiceService);
  httpClient: HttpClient = inject(HttpClient);
  feedbackService: FeedbackServiceService = inject(FeedbackServiceService);

  private shiftsSubject = new BehaviorSubject<Shift[]>([]);
  public shifts$ = this.shiftsSubject.asObservable();
  public selectedDate!: ShiftCreateDTO;


  private getApiUrl(): string {
    return `http://localhost:8080/api/${this.companyService.getCompanyId()}`
  }

  getShifts(): void{
    this.httpClient.get<Shift[]>(`${this.getApiUrl()}/shifts/`)
      .subscribe((shifts: Shift[]) => {
      this.shiftsSubject.next(shifts);
    });
  }

  addShift(newShift: NewShift): void {
    console.log(newShift);
    this.httpClient.post<Shift>(`${this.getApiUrl()}/shifts/create_with_assignments`, newShift)
      .subscribe((createdShift )=> {
        const currentShift = this.shiftsSubject.getValue();
        this.shiftsSubject.next([...currentShift, createdShift]);
    })
  }

  updateShift(shiftId: number, newShift: NewShift): Observable<Shift> {
    return this.httpClient.put<Shift>(`${this.getApiUrl()}/shifts/${shiftId}`, newShift)
      .pipe(
        // keep local cache in sync on success
        tap((updatedShift) => {
          const current = this.shiftsSubject.getValue();
          const idx = current.findIndex(s => s.id === updatedShift.id);
          if (idx !== -1) {
            current[idx] = updatedShift;
            this.shiftsSubject.next([...current]);
          } else {
            this.shiftsSubject.next([...current, updatedShift]);
          }
          this.feedbackService.newFeedback({ message: 'Schicht erfolgreich geändert', type: 'success', showFeedback: true })
        })
      );
  }

  getShiftById(shiftId: number): Observable<Shift> {
    return this.httpClient.get<Shift>(`${this.getApiUrl()}/shifts/${shiftId}`)
  }
}
