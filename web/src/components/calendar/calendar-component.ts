import { html, render } from "lit-html";
import { Calendar } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { loadAllShifts } from "../shift-list/shift-list-service";
import { model } from "../../model/model";

const template = () => html`
  <style>
    #calendar {
      width: 90vw;
      height: 80vh;
    }
  </style>
  <div id="calendar"></div>
`;

class CalendarComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    render(template(), this.shadowRoot!);

    await loadAllShifts();

    const calendarEl = this.shadowRoot?.getElementById("calendar");
    if (!calendarEl) return;

    const events = model.shifts.map(shift => {
      const start = new Date(String(shift.startTime));
      const end = new Date(String(shift.endTime));
      console.log(shift);
      
      return {
        title: String(shift.company_name),
        start,
        end,
      };
    });

    const calendar = new Calendar(calendarEl, {
      plugins: [timeGridPlugin, dayGridPlugin],
      themeSystem: "standard",
      initialView: "timeGridWeek",
      slotMinTime: "06:00:00",
      slotMaxTime: "24:00:00",
      firstDay: 1,
      views: {
        timeGridWeek: {
          allDaySlot: false,
        },
        timeGridDay: {
          allDaySlot: false,
        },
        dayGridMonth: {
        }
      },
      
      dayHeaderFormat:{
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      },
      slotLabelFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
      eventTimeFormat: { hour: "2-digit", minute: "2-digit", hour12: false },
      events: events,
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
    });

    calendar.render();
  }
}

customElements.define("calendar-component", CalendarComponent);