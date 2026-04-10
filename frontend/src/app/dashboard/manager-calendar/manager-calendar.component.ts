import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FullCalendarModule} from '@fullcalendar/angular';
import {Shift} from '../../interfaces/shift';
import {ShiftServiceService} from '../../shift/shift-service/shift-service.service';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {KeycloakOperationService} from '../../services/keycloak-service/keycloak.service';
import {CalendarOptions, DateSelectArg, EventClickArg} from '@fullcalendar/core';
import deLocale from '@fullcalendar/core/locales/de';
import interactionPlugin, {DateClickArg} from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {ShiftCreate} from '../../interfaces/shift-create';

@Component({
  selector: 'app-manager-calendar',
  imports: [
    FullCalendarModule,
  ],
  templateUrl: './manager-calendar.component.html',
  styleUrl: './manager-calendar.component.css'
})
export class ManagerCalendarComponent implements OnInit {
  shifts: Shift[] = [];
  selectedShift: Shift = this.shifts[0];
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  @Input() isAllowedToEdit: boolean = false;
  @Input() initialView!: string;
  @Output() openShiftEdit = new EventEmitter<Shift>();
  @Output() openShiftAdd = new EventEmitter<ShiftCreate>();



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




  ngOnInit(): void {
    this.setResponsiveCalendarView();

    window.addEventListener('resize', () => {
      this.setResponsiveCalendarView();
    });

    if(!this.isAllowedToEdit){
      this.isAllowedToEdit = this.keycloakOperationService.getUserRoles().includes('user-is-manager');
      console.log(this.isAllowedToEdit);
    }

    this.shiftService.shifts$.subscribe((data) => {
      this.shifts = data;
      this.loadShiftsToEvents(data);
    });

    this.shiftService.getShifts();
  }

  setResponsiveCalendarView(): void {
    if (this.isSmallScreen()) {
      this.calendarOptions.initialView = 'listWeek'
      this.calendarOptions.headerToolbar = {
        start: '',
        center: 'title',
        end: ''
      }
      this.calendarOptions.footerToolbar = {
        start: 'prev,today,next',
        end: 'dayGridMonth,timeGridDay,listWeek'
      }
    } else {
      this.calendarOptions.initialView = this.initialView;
      this.calendarOptions.headerToolbar = {
        start: 'prev,today,next',
        center: 'title',
        end: 'dayGridMonth,timeGridDay,listWeek'
      }
      this.calendarOptions.footerToolbar = {
        start: '',
        end: ''
      }
    }
  }

  isSmallScreen(): boolean {
    return window.innerWidth < 1300; // Tailwind's `md` breakpoint
  }

  loadShiftsToEvents(data:Shift[]): void {

    this.calendarOptions.events = data.map(shift => ({
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
    const startTime: string = this.getStringFromArg(arg.event.start!);
    const endTime: string = this.getStringFromArg(arg.event.end!);

    let  selectedShift: Shift = {
      shiftName: "",
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      id: Number(arg.event.id),
      assignments: [],
    }


    this.openShiftEdit.emit(selectedShift);
  }

  closeShiftEdit() {
    this.isEditMode = false;
  }

  openAddShift(newShift: ShiftCreate): void {
    this.shiftService.selectedDate = newShift;
    this.isAddMode = true;
    this.openShiftAdd.emit(newShift);

  }

  closeAddShift() {
    this.isAddMode = false;
  }



}
