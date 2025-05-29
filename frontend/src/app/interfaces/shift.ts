import {CalendarOptions} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

export interface Shift {
  id: number;
  startTime: string;     // ISO timestamp string
  endTime: string;       // ISO timestamp string
  company_id: number;
  company_name: string;
  employees: number[];    // Array of employee IDs
  reservations: number[]; // Array of reservation IDs
}
