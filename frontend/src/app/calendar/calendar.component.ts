import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import {Calendar, CalendarOptions, DateSelectArg} from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {DateClickArg, Draggable} from '@fullcalendar/interaction';
import {EmployeeServiceService} from '../employee-service/employee-service.service';
import {ShiftServiceService} from '../shift-service/shift-service.service';
import {Employee} from '../interfaces/employee';
import {Shift} from '../interfaces/shift';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {ShiftEditComponent} from '../shift-edit/shift-edit.component';
import {ShiftTemplate} from '../interfaces/shift-template';
import { CompanyServiceService} from '../company-service/company-service.service';
import {ShiftAddComponent} from '../shift-add/shift-add.component';
import {ShiftCreateDTO} from '../interfaces/new-shift';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, FullCalendarModule, ShiftEditComponent, ShiftAddComponent],
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
  @Input() initialView!: string;

  constructor(private shiftService: ShiftServiceService, private companyService: CompanyServiceService) {}


  ngOnInit(): void {
    this.shiftService.shifts$.subscribe((data) => {
      this.shifts = data;
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

  getStringFromArg(arg: Date) {
    const month = arg.getMonth() + 1;

    return `${arg.getFullYear()}-${month.toString().padStart(2, '0')}-${arg.getDate().toString().padStart(2, '0')}T${arg.getHours().toString().padStart(2, '0')}:${arg.getMinutes().toString().padStart(2, '0')}:${arg.getSeconds().toString().padStart(2, '0')}`;
  }

  handleDateClick(arg:DateClickArg) {
    let  newShift: ShiftCreateDTO = {
      companyId: this.companyService.getCompanyId(),
      startTime: arg.date.toString(),
      endTime: arg.date.toString(),
    }
    this.openAddShift(newShift)
  }

  handleDateSelected(arg: DateSelectArg) {
    const newStartTime: string = this.getStringFromArg(arg.start);
    const newEndTime: string = this.getStringFromArg(arg.end);
    let  newShift: ShiftCreateDTO = {
      companyId: this.companyService.getCompanyId(),
      startTime: newStartTime,
      endTime: newEndTime,
    }
    //2024-12-19T09:00:00
    this.openAddShift(newShift);
  }

  openShiftEdit(shift: Shift): void {
    this.isEditMode = true;
    this.selectedShift = shift;
  }
  closeShiftEdit() {
    this.isEditMode = false;
  }

  openAddShift(newShift: ShiftCreateDTO): void {
    this.shiftService.selectedDate = newShift;
    this.isAddMode = true;
  }

  closeAddShift() {
    this.isAddMode = false;
  }



}
