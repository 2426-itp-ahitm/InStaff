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
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {AddEmployeeComponent} from '../add-employee/add-employee.component';
import {EmployeeEditComponent} from '../employee-edit/employee-edit.component';
import {ShiftEditComponent} from '../shift-edit/shift-edit.component';
import {AddShiftComponent} from '../add-shift/add-shift.component';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, RouterOutlet, FullCalendarModule, AddEmployeeComponent, EmployeeEditComponent, ShiftEditComponent, AddShiftComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    titleFormat: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour12: false,
    },
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    themeSystem: 'litera',
    dateClick: (arg) => this.handleDateClick(arg),
    events: [
      { title: 'event 1', date: '2025-06-04' },
      { title: 'event 2', date: '2025-06-05' }
    ],
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,

    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
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
      this.loadShiftsToEvents();
    });
    this.shiftService.getShifts();
  }

  loadShiftsToEvents(): void {
    this.calendarOptions.events = this.shifts.map(shift => ({
      title: `Shift ${shift.id}`,
      start: shift.startTime,
      end: shift.endTime
    }));
  }

  handleDateClick(arg:DateClickArg) {
    this.openAddShift(arg)

  }

  openShiftEdit(shift: Shift): void {
    this.isEditMode = true;
    this.selectedShift = shift;
  }
  closeShiftEdit() {
    this.isEditMode = false;
  }

  openAddShift(arg: DateClickArg) {
    this.isAddMode = true;
  }

  closeAddShift() {
    this.isAddMode = false;
  }
}
