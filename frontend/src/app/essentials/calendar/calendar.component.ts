import {Component, inject, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import {Calendar, CalendarOptions, DateSelectArg, EventClickArg} from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {DateClickArg, Draggable} from '@fullcalendar/interaction';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {ShiftServiceService} from '../../shift/shift-service/shift-service.service';
import {Employee} from '../../interfaces/employee';
import {Shift} from '../../interfaces/shift';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CompanyServiceService} from '../../services/company-service/company-service.service';
import {ShiftCreateDTO} from '../../interfaces/new-shift';
import deLocale from '@fullcalendar/core/locales/de';
import { ShiftAddComponent } from "../../shift/shift-add/shift-add.component";
import {ShiftEditOldComponent} from '../../shift/shift-edit-old/shift-edit-old.component';
import {ShiftEditComponent} from '../../shift/shift-edit/shift-edit.component';

@Component({
  selector: 'app-calendar',
  imports: [
    CommonModule,
    FullCalendarModule,
    ShiftAddComponent,
    ShiftEditOldComponent,
    ShiftEditComponent
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    locale: deLocale,
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
      right: 'dayGridMonth,timeGridDay,listWeek'
    },
    footerToolbar: {
      left: 'prevYear',
      center: '',
      right: 'nextYear'
    },
    themeSystem: 'Minty',
    dateClick: (arg) => this.handleDateClick(arg),
    select: (arg) => this.handleDateSelected(arg),
    eventClick: (arg) => this.handleEventSelected(arg),
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

  shiftService: ShiftServiceService = inject(ShiftServiceService)
  companyService: CompanyServiceService = inject(CompanyServiceService)


  ngOnInit(): void {
    this.setResponsiveCalendarView();

    window.addEventListener('resize', () => {
      this.setResponsiveCalendarView();
    });

    this.shiftService.shifts$.subscribe((data) => {
      this.shifts = data;
      this.loadShiftsToEvents();
    });

    this.shiftService.getShifts();
  }

  setResponsiveCalendarView(): void {
    if (this.isSmallScreen()) {
      this.calendarOptions.initialView = 'listMonth'
      this.calendarOptions.headerToolbar = {
        start: '',
        center: 'title',
        end: ''
      }
      this.calendarOptions.footerToolbar = {
        start: 'prev,next today',
        end: 'dayGridMonth,timeGridDay,listMonth'
      }
    } else {
      this.calendarOptions.initialView = this.initialView;
      this.calendarOptions.headerToolbar = {
        start: 'prev,next today',
        center: 'title',
        end: 'dayGridMonth,dayGridWeek,timeGridDay,listMonth'
      }
      this.calendarOptions.footerToolbar = {
        start: '',
        end: ''
      }
    }
  }

  isSmallScreen(): boolean {
    return window.innerWidth < 1280; // Tailwind's `md` breakpoint
  }

  loadShiftsToEvents(): void {
    this.calendarOptions.events = this.shifts.map(shift => ({
      title: `Shift ${shift.id}`,
      start: shift.startTime,
      end: shift.endTime,
      id: String(shift.id),
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

  handleEventSelected(arg: EventClickArg) {
    const startTime: string = this.getStringFromArg(arg.event.start!);
    const endTime: string = this.getStringFromArg(arg.event.end!);

    let  selectedShift: Shift = {
      companyId: this.companyService.getCompanyId(),
      startTime: startTime,
      endTime: endTime,
      companyName: "",
      id: Number(arg.event.id),
      employees: [],
      assignments: [],
      reservations: []
    }


    this.openShiftEdit(selectedShift);
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
