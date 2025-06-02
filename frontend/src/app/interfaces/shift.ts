import {Assignment} from './assignment';

export interface Shift {
  id: number;
  startTime: string;     // ISO timestamp string
  endTime: string;       // ISO timestamp string
  company_id: number;
  company_name: string;
  employees: number[];    // Array of employee IDs
  assignments: Assignment[];
  reservations: number[]; // Array of reservation IDs
}

export interface NewShift {
  company_id: number;
  startTime: Date;
  endTime: Date;
}
