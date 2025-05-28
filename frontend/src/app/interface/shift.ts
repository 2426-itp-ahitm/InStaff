export interface Shift {
  id: number;
  startTime: string;     // ISO timestamp string
  endTime: string;       // ISO timestamp string
  company_id: number;
  company_name: string;
  employees: number[];    // Array of employee IDs
  reservations: number[]; // Array of reservation IDs
}
