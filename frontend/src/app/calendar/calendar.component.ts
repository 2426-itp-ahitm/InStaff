import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import {Calendar, CalendarOptions} from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {DateClickArg, Draggable} from '@fullcalendar/interaction';
import {EmployeeServiceService} from '../employee-service.service';
import {ShiftServiceService} from '../shift-service.service';
import {Employee} from '../interface/employee';
import { Shift } from '../interface/shift';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, RouterOutlet, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    themeSystem: 'litera',
    dateClick: (arg) => this.handleDateClick(arg),
    events: [
      { title: 'event 1', date: '2025-06-04' },
      { title: 'event 2', date: '2025-06-05' }
    ]
  };

  shifts: Shift[] = [];
  selectedShift: Shift = this.shifts[0];
  isAddMode: boolean = false;
  isEditMode: boolean = false;

  constructor(private shiftService: ShiftServiceService) {}


  ngOnInit(): void {
    this.shiftService.shifts$.subscribe((data) => {
      this.shifts = data;
      console.log(this.shifts);
    });
    this.shiftService.getShifts();
  }

  handleDateClick(arg:DateClickArg) {
    alert('date click! ' + arg.dateStr)
  }
}
