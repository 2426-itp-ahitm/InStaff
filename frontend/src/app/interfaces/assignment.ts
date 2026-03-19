import {EmployeeShort} from './employee-short';
import {ShiftShort} from './shift-short';
import {Role} from './role';

export interface Assignment {
  id: number;
  confirmed: boolean | null;
  seen: boolean;
  employee: EmployeeShort;
  shift: ShiftShort;
  role: Role;
}
