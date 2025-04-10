import { html, render } from "lit-html";
import { Calendar } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from '@fullcalendar/interaction';
import { loadAllShifts } from "../shift-list/shift-list-service";
import { model, subscribe } from "../../model/model";
import { loadAllReservations } from "../../services/reservation-service";
import { Employee } from "src/interfaces/employee";
import { Reservation } from "src/interfaces/reservation";

const template = (activeShiftId: number) => html`
  <style>
    #calendar {
      width: 90vw;
      height: 80vh;
    }
  </style>
  <shift-detail-component .shiftId="${activeShiftId}"></shift-detail-component>
  <div id="calendar"></div>
`;

class CalendarComponent extends HTMLElement {
  activeShiftId: number;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    subscribe(model => {
      this.activeShiftId = model.activeShiftId;
      this.updateTemplate();
    });

    render(template(this.activeShiftId), this.shadowRoot!);

    await loadAllShifts();
    await loadAllReservations();

    const calendarEl = this.shadowRoot?.getElementById("calendar");
    if (!calendarEl) return;

    const events = model.shifts.map(shift => {
      const start = new Date(String(shift.startTime));
      const end = new Date(String(shift.endTime));
      
      const employees: Employee[] = []

      for(let i = 0; i < shift.employees.length; i++){
        const employee = model.employees.find((employee) => shift.employees[i].id === employee.id);
        employees.push(employee);
      }
      
      return {
        title: '',
        start,
        end,
        extendedProps: {
          shiftId: shift.id,
        },
      };
    });

    const calendar = new Calendar(calendarEl, {
      plugins: [timeGridPlugin, dayGridPlugin, interactionPlugin],
      selectable: true,
      themeSystem: "standard",
      initialView: "timeGridWeek",
      slotMinTime: "00:00:00",
      slotMaxTime: "24:00:00",
      firstDay: 1,
      businessHours:{
        daysOfWeek: [2, 3, 4, 5, 6, 7],
        startTime: "10:00",
        endTime: "24:00"
      },
      nowIndicator: true,
      views: {
        timeGridWeek: { allDaySlot: false },
        timeGridDay: { allDaySlot: false },
      },
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      dayHeaderFormat: {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      },
      slotLabelFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
      eventTimeFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
      dateClick : (info) => {
        alert('Clicked on: ' + info.dateStr);
      },
      select: (info) => {
        alert('Selected: ' + info.startStr + ' to ' + info.endStr);
      },
      events: events,
      eventDidMount: (info) => {
        const resCount = info.event.extendedProps.reservations?.length || 0;
        const empCount = info.event.extendedProps.employeesCount || 0;

        const isMonthView = calendar.view.type === 'dayGridMonth';
        const title = isMonthView
          ? `Res: ${resCount}\nEmp: ${empCount}`
          : `Reservations: ${resCount}\nEmployees: ${empCount}`;

        const titleEl = info.el.querySelector('.fc-event-title');
        if (titleEl) {
          titleEl.textContent = title;
        }
      },
      eventClick: (info) => {
        const shiftId = info.event.extendedProps.shiftId;
        //alert(info.event.extendedProps.reservations);
        this.showShiftDetail(shiftId);
      },
    });

    calendar.render();
  }
  //TODO: Implement add shift with dateClick and selectable date/times https://fullcalendar.io/docs/date-clicking-selecting

  showShiftDetail(shiftId: number) {
    this.activeShiftId = shiftId;
    this.updateTemplate();
  }

  updateTemplate() {
    render(template(this.activeShiftId), this.shadowRoot!);
  }
}

customElements.define("calendar-component", CalendarComponent);