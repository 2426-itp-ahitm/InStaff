import { EmployeeRole } from './employee-role';

export interface Employee {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  telephone: string;
  password: string;
  birthdate: string; // ISO-Date als string (z. B. "2004-11-11")
  company_id: number;
  company_name: string;
  roles: EmployeeRole[];
  shifts: number[];   // Array von Shift-IDs
}
