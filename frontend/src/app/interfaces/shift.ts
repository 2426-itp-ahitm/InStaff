import {Assignment} from './assignment';

export interface Shift {
  id: number;
  startTime: string;     // ISO timestamp string
  endTime: string;       // ISO timestamp string
  companyId: number;
  companyName: string;
  employees: number[];    // Array of employee IDs
  assignments: Assignment[];
  reservations: number[]; // Array of reservation IDs
}

export interface NewShift {
  companyId: number;
  startTime: Date;
  endTime: Date;
}
