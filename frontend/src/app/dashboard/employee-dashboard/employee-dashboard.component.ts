import {Component, inject, ViewChild} from '@angular/core';
import {CalendarComponent} from '../../essentials/calendar/calendar.component';
import {NewsComponent} from '../../news/news/news.component';
import {ShiftServiceService} from '../../shift/shift-service/shift-service.service';
import {Shift} from '../../interfaces/shift';
import {EmployeeCalendarComponent} from '../employee-calendar/employee-calendar.component';
import {NgIf} from '@angular/common';
import {ShiftViewComponent} from '../../shift/shift-view/shift-view.component';

@Component({
  selector: 'app-employee-dashboard',
  imports: [
    CalendarComponent,
    NewsComponent,
    EmployeeCalendarComponent,
    NgIf,
    ShiftViewComponent
  ],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.css'
})
export class EmployeeDashboardComponent {
  @ViewChild(CalendarComponent) calendar!: EmployeeCalendarComponent;
  shiftService: ShiftServiceService = inject(ShiftServiceService);

  selectedShift!: Shift;
  isViewMode: boolean = false;


  openShiftViewWithId(shiftId: number) {
    console.log(shiftId);


    this.shiftService.getShiftById(shiftId).subscribe((shift: Shift) => {
      // delegate to calendar component to open the shift editor (guard in case ViewChild not ready)
      this.selectedShift = shift;
      this.isViewMode = true;
    });
  }

  closeShiftView(){
    this.isViewMode = false;
  }


}

