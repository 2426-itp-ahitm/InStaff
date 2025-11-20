import { Component, ViewChild, inject } from '@angular/core';
import {CalendarComponent} from '../calendar/calendar.component';
import {NewsComponent} from '../../news/news/news.component';
import { ShiftServiceService } from '../../shift/shift-service/shift-service.service';
import { Shift } from '../../interfaces/shift';

@Component({
  selector: 'app-home',
  imports: [
    CalendarComponent,
    NewsComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
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
