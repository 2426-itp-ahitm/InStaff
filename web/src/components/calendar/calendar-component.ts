import { html, render } from "lit-html";
import { Calendar } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { loadAllShifts } from "../shift-list/shift-list-service";
import { model, subscribe } from "../../model/model";

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

    const calendarEl = this.shadowRoot?.getElementById("calendar");
    if (!calendarEl) return;

    const events = model.shifts.map(shift => {
      const start = new Date(String(shift.startTime));
      const end = new Date(String(shift.endTime));
      
      return {
        title: String(shift.company_name),
        start,
        end,
        extendedProps: {
          shiftId: shift.id,
        }
      };
    });

    const calendar = new Calendar(calendarEl, {
      plugins: [timeGridPlugin, dayGridPlugin],
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
      dayHeaderFormat: {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      },
      slotLabelFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
      eventTimeFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
      events: events,
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      eventClick: (info) => {
        const shiftId = info.event.extendedProps.shiftId;
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