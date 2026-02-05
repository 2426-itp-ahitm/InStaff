import {Component, inject, ViewChild} from '@angular/core';
import {CalendarComponent} from '../calendar/calendar.component';
import {ShiftServiceService} from '../../shift/shift-service/shift-service.service';
import {Shift} from '../../interfaces/shift';
import {NewsComponent} from '../../news/news/news.component';

@Component({
  selector: 'app-manager-dashboard',
  imports: [
    CalendarComponent,
    NewsComponent
  ],
  templateUrl: './manager-dashboard.component.html',
  styleUrl: './manager-dashboard.component.css'
})
export class ManagerDashboardComponent {
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
