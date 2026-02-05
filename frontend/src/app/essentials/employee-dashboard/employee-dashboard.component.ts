import {Component, inject, ViewChild} from '@angular/core';
import {CalendarComponent} from '../calendar/calendar.component';
import {NewsComponent} from '../../news/news/news.component';
import {ShiftServiceService} from '../../shift/shift-service/shift-service.service';
import {Shift} from '../../interfaces/shift';

@Component({
  selector: 'app-employee-dashboard',
  imports: [
    CalendarComponent,
    NewsComponent
  ],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css'
})
export class EmployeeDashboardComponent {
  @ViewChild(CalendarComponent) calendar!: CalendarComponent;

  shiftService: ShiftServiceService = inject(ShiftServiceService);

  openShiftEditWithId(shiftId: number) {
    this.shiftService.getShiftById(shiftId).subscribe((shift: Shift) => {
      // delegate to calendar component to open the shift editor (guard in case ViewChild not ready)
      if (this.calendar && typeof this.calendar.openShiftEdit === 'function') {
        this.calendar.openShiftEdit(shift);
      }
    });
  }
}

