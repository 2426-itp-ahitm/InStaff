import {inject, Injectable} from '@angular/core';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, forkJoin, Observable} from 'rxjs';
import {Shift} from '../../interfaces/shift';
import {tap} from 'rxjs/operators';
import {FeedbackServiceService} from '../../feedback/feedback-service/feedback-service.service';
import {ApiUrlService} from '../../services/api-url/api-url.service';
import {ShiftCreate} from '../../interfaces/shift-create';
import {ShiftCreateAssignments} from '../../interfaces/shift-create-assignments';

@Injectable({
  providedIn: 'root'
})
export class ShiftServiceService {
  companyService: CompanyServiceService = inject(CompanyServiceService);
  httpClient: HttpClient = inject(HttpClient);
  feedbackService: FeedbackServiceService = inject(FeedbackServiceService);
  apiUrl: ApiUrlService = inject(ApiUrlService);

  private shiftsSubject = new BehaviorSubject<Shift[]>([]);
  public shifts$ = this.shiftsSubject.asObservable();

  private employeeShiftsSubject = new BehaviorSubject<Shift[]>([]);
  public employeeShifts$ = this.employeeShiftsSubject.asObservable();

  public selectedDate!: ShiftCreate;


  private getApiUrl(): string {
    return this.apiUrl.getApiUrl();
    //return `http://localhost:8080/api/${this.companyService.getCompanyId()}`
  }

  getShifts(): void{
    this.httpClient.get<Shift[]>(`${this.getApiUrl()}/shifts/`)
      .subscribe((shifts: Shift[]) => {
      this.shiftsSubject.next(shifts);
    });
  }

  getShiftByEmployeeId(empId: number): void {
    this.httpClient.get<Shift[]>(`${this.getApiUrl()}/shifts/employee/self/`).
    subscribe((shifts: Shift[]) => {
      this.employeeShiftsSubject.next(shifts);
    });
  }

  private toLocalDateTimeString(dateValue: Date | string): string {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  // TODO: empty assignments don't work
  addShift(shiftWithAssignments:ShiftCreateAssignments): Observable<Response> {
    const payload = {
      ...shiftWithAssignments,
      shiftCreateDTO: {
        ...shiftWithAssignments.shiftCreateDTO,
        startTime: this.toLocalDateTimeString(shiftWithAssignments.shiftCreateDTO.startTime),
        endTime: this.toLocalDateTimeString(shiftWithAssignments.shiftCreateDTO.endTime),
      }
    };
    console.log(payload);
    return this.httpClient.post<Response>(`${this.getApiUrl()}/shifts/create-with-assignments`, payload).pipe(
      tap({
        next: () => {
          this.feedbackService.newFeedback({ message: 'Schicht erfolgreich erstellt', type: 'success', showFeedback: true });
          this.getShifts();
        },
        error: () => {
          this.feedbackService.newFeedback({ message: 'Schicht konnte nicht erstellt werden', type: 'error', showFeedback: true });
        }
      })
    );

  }

  // TODO: add assignments
  updateShift(shiftId: number, newShift: ShiftCreate): Observable<Shift> {
    console.log("*****0***")
    console.log(newShift);
    const updateShift = {
      shiftName: newShift.shiftName,
      startTime: this.toLocalDateTimeString(newShift.startTime),
      endTime: this.toLocalDateTimeString(newShift.endTime),
    }
    return this.httpClient.put<Shift>(`${this.getApiUrl()}/shifts/${shiftId}`, updateShift)
      .pipe(
        // keep local cache in sync on success
        tap((updatedShift) => {
          console.log("******1*****")
          console.log(updatedShift)
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


  deleteShift(shiftId: number) {
    return this.httpClient.delete<Shift>(`${this.getApiUrl()}/shifts/delete/${shiftId}`)
  }
}
