import {inject, Injectable} from '@angular/core';
import {CompanyServiceService} from '../company-service/company-service.service';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, forkJoin} from 'rxjs';
import {Employee} from '../interfaces/employee';
import {Shift} from '../interfaces/shift';
import {switchMap} from 'rxjs/operators';
import {DateClickArg} from '@fullcalendar/interaction';
import {ShiftTemplate} from '../interfaces/shift-template';
import {NewShift, ShiftCreateDTO} from '../interfaces/new-shift';

@Injectable({
  providedIn: 'root'
})
export class ShiftServiceService {
  companyService: CompanyServiceService = inject(CompanyServiceService);
  httpClient: HttpClient = inject(HttpClient);

  private shiftsSubject = new BehaviorSubject<Shift[]>([]);
  public shifts$ = this.shiftsSubject.asObservable();
  public selectedDate!: ShiftCreateDTO;

  private oldApiUrl = 'http://localhost:8080/api';

  private getApiUrl(): string {
    return `http://localhost:8080/api/${this.companyService.getCompanyId()}`
    //return this.oldApiUrl;
  }

  getShifts(): void{
    this.httpClient.get<Shift[]>(`${this.getApiUrl()}/shifts/`)
      .subscribe((shifts: Shift[]) => {
      this.shiftsSubject.next(shifts);
    });
  }

  addShift(newShift: NewShift): void {
    this.httpClient.post<Shift>(`${this.getApiUrl()}/shifts/create_with_assignments`, newShift)
      .subscribe((createdShift )=> {
        const currentShift = this.shiftsSubject.getValue();
        this.shiftsSubject.next([...currentShift, createdShift]);
    })
  }
}
