import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import {Calendar, CalendarOptions, DateSelectArg} from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {DateClickArg, Draggable} from '@fullcalendar/interaction';
import {EmployeeServiceService} from '../employee-service/employee-service.service';
import {ShiftServiceService} from '../shift-service/shift-service.service';
import {Employee} from '../interfaces/employee';
import {NewShift, Shift} from '../interfaces/shift';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {ShiftEditComponent} from '../shift-edit/shift-edit.component';
import {AddShiftComponent} from '../add-shift/add-shift.component';
import {ShiftTemplate} from '../interfaces/shift-template';
import { CompanyServiceService} from '../company-service/company-service.service';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, FullCalendarModule, ShiftEditComponent, AddShiftComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    titleFormat: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hourCycle: 'h23'
    },
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    slotMinTime: "00:00:00",
    slotMaxTime: "24:00:00",
    firstDay: 1,
    businessHours: {
      daysOfWeek: [2, 3, 4, 5, 6, 0],
      startTime: "10:00",
      endTime: "24:00"
    },

    slotLabelFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    themeSystem: 'litera',
    dateClick: (arg) => this.handleDateClick(arg),
    select: (arg) => this.handleDateSelected(arg),
    events: [
      { title: 'event 1', date: '2025-05-31' },
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

  constructor(private shiftService: ShiftServiceService, private companyService: CompanyServiceService) {}


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
    let  newShift: NewShift = {
      company_id: this.companyService.getCompanyId(),
      startTime: arg.date,
      endTime: arg.date
    }
    console.log(newShift);
    this.openAddShift(newShift)
  }

  handleDateSelected(arg: DateSelectArg) {
    let newShift: NewShift = {
      company_id: this.companyService.getCompanyId(),
      startTime: arg.start,
      endTime: arg.end
    };
    this.openAddShift(newShift);
  }

  openShiftEdit(shift: Shift): void {
    this.isEditMode = true;
    this.selectedShift = shift;
  }
  closeShiftEdit() {
    this.isEditMode = false;
  }

  openAddShift(newShift: NewShift): void {
    this.shiftService.selectedDate = newShift;
    this.isAddMode = true;
  }

  closeAddShift() {
    this.isAddMode = false;
  }


}
