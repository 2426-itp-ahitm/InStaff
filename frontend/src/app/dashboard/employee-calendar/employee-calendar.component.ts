import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FullCalendarModule} from '@fullcalendar/angular';
import {ShiftViewComponent} from '../../shift/shift-view/shift-view.component';
import {Shift} from '../../interfaces/shift';
import {ShiftServiceService} from '../../shift/shift-service/shift-service.service';
import {CompanyServiceService} from '../../services/company-service/company-service.service';
import {KeycloakOperationService} from '../../services/keycloak-service/keycloak.service';
import {CalendarOptions, EventClickArg} from '@fullcalendar/core';
import deLocale from '@fullcalendar/core/locales/de';
import interactionPlugin, {DateClickArg} from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {KeycloakService} from 'keycloak-angular';

@Component({
  selector: 'app-employee-calendar',
  imports: [
    FullCalendarModule,
    ShiftViewComponent
  ],
  templateUrl: './employee-calendar.component.html',
  styleUrl: './employee-calendar.component.css'
})
export class EmployeeCalendarComponent implements OnInit {
  shifts: Shift[] = [];
  selectedShift: Shift = this.shifts[0];
  isViewMode: boolean = false;
  @Input() isAllowedToEdit: boolean = false;
  @Input() initialView!: string;
  @Output() openShiftView = new EventEmitter<Shift>();


  shiftService: ShiftServiceService = inject(ShiftServiceService)
  companyService: CompanyServiceService = inject(CompanyServiceService)
  keycloakOperationService: KeycloakOperationService = inject(KeycloakOperationService);
  keycloackService: KeycloakService = inject(KeycloakService);
  employeeService: EmployeeServiceService = inject(EmployeeServiceService);

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
      left: 'prev, today, next',
      center: 'title',
      right: 'dayGridMonth,timeGridDay,listWeek'
    },
    footerToolbar: {
      left: 'prevYear',
      center: '',
      right: 'nextYear'
    },
    themeSystem: 'Minty',
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

    this.shiftService.employeeShifts$.subscribe((data) => {
      this.shifts = data;
      this.loadShiftsToEvents();
    });

    this.employeeService.getEmployeeByKeykloackId(this.keycloackService.getKeycloakInstance().subject!).subscribe(() => {
      this.shiftService.getSelfShifts();
    });

  }

  handleEventSelected(arg: EventClickArg) {
    const startTime: string = this.getStringFromArg(arg.event.start!);
    const endTime: string = this.getStringFromArg(arg.event.end!);

    let selectedShift: Shift = {
      shiftName: "",
      startTime: new Date(startTime),
      endTime: new Date(startTime),
      id: Number(arg.event.id),
      assignments: []
    }


    this.openShiftView.emit(selectedShift);
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
        center: 'prev,today,next',
      }
    } else {
      this.calendarOptions.initialView = this.initialView;
      this.calendarOptions.headerToolbar = {
        start: '',
        center: 'title',
        end: ''
      }
      this.calendarOptions.footerToolbar = {
        start: 'prev,today,next',
        end: 'dayGridMonth,timeGridDay,listMonth'
      }
    }
  }



  isSmallScreen(): boolean {
    return window.innerWidth < 1000; // Tailwind's `md` breakpoint
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


  closeShiftView() {
    this.isViewMode = false;
  }




}
