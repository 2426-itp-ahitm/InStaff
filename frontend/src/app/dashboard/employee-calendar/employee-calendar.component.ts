import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FullCalendarModule} from '@fullcalendar/angular';
import {NgIf} from '@angular/common';
import {ShiftAddComponent} from '../../shift/shift-add/shift-add.component';
import {ShiftEditComponent} from '../../shift/shift-edit/shift-edit.component';
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
import {ShiftCreateDTO} from '../../interfaces/new-shift';

@Component({
  selector: 'app-employee-calendar',
  imports: [
    FullCalendarModule,
    NgIf,
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
      this.loadShiftsToEvents();
    });

    this.shiftService.getShifts();
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


  closeShiftView() {
    this.isViewMode = false;
  }




}
