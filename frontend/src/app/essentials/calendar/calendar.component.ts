import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg} from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {DateClickArg, Draggable} from '@fullcalendar/interaction';
import {ShiftServiceService} from '../../shift/shift-service/shift-service.service';
import {Shift} from '../../interfaces/shift';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CompanyServiceService} from '../../services/company-service/company-service.service';
import deLocale from '@fullcalendar/core/locales/de';
import { ShiftAddComponent } from "../../shift/shift-add/shift-add.component";
import {ShiftEditComponent} from '../../shift/shift-edit/shift-edit.component';
import {ShiftViewComponent} from '../../shift/shift-view/shift-view.component';
import {KeycloakOperationService} from '../../services/keycloak-service/keycloak.service';
import {ShiftCreate} from '../../interfaces/shift-create';

@Component({
  selector: 'app-calendar',
  imports: [
    CommonModule,
    FullCalendarModule,
    ShiftAddComponent,
    ShiftEditComponent,
    ShiftViewComponent
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit {
  shifts: Shift[] = [];
  selectedShift: Shift = this.shifts[0];
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  @Input() isAllowedToEdit: boolean = false;
  @Input() initialView!: string;
  @Output() openShiftView = new EventEmitter<string>();


  shiftService: ShiftServiceService = inject(ShiftServiceService)
  companyService: CompanyServiceService = inject(CompanyServiceService)
  keycloakOperationService: KeycloakOperationService = inject(KeycloakOperationService);


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
      left: 'prev,today,next',
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
    handleWindowResize: false,
    viewHeight: 'auto',

    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };




  ngOnInit(): void {
    this.setResponsiveCalendarView();

    if(!this.isAllowedToEdit){
      this.isAllowedToEdit = this.keycloakOperationService.getUserRoles().includes('user-is-manager');
    }

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
        left: '',
        center: 'title',
        right: ''
      }
      this.calendarOptions.footerToolbar = {
        left: 'prev,today,next',
        right: 'timeGridDay,listMonth'
      }
    } else {
      this.calendarOptions.initialView = this.initialView || 'dayGridMonth';
    }
  }

  isSmallScreen(): boolean {
    return window.innerWidth < 1280; // Tailwind's `md` breakpoint
  }

  loadShiftsToEvents(): void {
    this.calendarOptions.events = this.shifts.map(shift => ({
      title: shift.shiftName,
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
    let startTime: Date = arg.date;
    let endTime: Date = arg.date;

    if(startTime.getHours().toString() == "0" && endTime.getHours().toString() == "0"){
      startTime.setHours(this.companyService.getDefaultStartingHour())
      endTime.setDate(endTime.getDate() -1);
      endTime.setHours(this.companyService.getDefaultEndingHour())
    }

    let  newShift: ShiftCreate = {
      shiftName: "",
      startTime: startTime,
      endTime: endTime
    }
    this.openAddShift(newShift)
  }

  handleDateSelected(arg: DateSelectArg) {
    let startTime: Date = arg.start;
    let endTime: Date = arg.end;


    if(startTime.getHours().toString() == "0" && endTime.getHours().toString() == "0"){
      startTime.setHours(this.companyService.getDefaultStartingHour())
      endTime.setDate(endTime.getDate() -1);
      endTime.setHours(this.companyService.getDefaultEndingHour())
    }



    let  newShift: ShiftCreate = {
      shiftName: "",
      startTime: startTime,
      endTime: endTime
    }
    this.openAddShift(newShift);
  }

  handleEventSelected(arg: EventClickArg) {

    let  selectedShift: Shift = {
      shiftName: "",
      startTime: arg.event.start!,
      endTime: arg.event.end!,
      id: Number(arg.event.id),
      assignments: [],
    }


    this.openShiftEdit(selectedShift);
  }

  openShiftEdit(shift: Shift): void {
    this.isEditMode = true;
    this.selectedShift = shift;
    console.log("test")
  }
  closeShiftEdit() {
    this.isEditMode = false;
  }

  openAddShift(newShift: ShiftCreate): void {
    this.shiftService.selectedDate = newShift;
    this.isAddMode = true;
  }

  closeAddShift() {
    this.isAddMode = false;
  }



}
