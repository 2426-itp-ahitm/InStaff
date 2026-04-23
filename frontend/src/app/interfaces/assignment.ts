import {EmployeeShort} from './employee-short';
import {ShiftShort} from './shift-short';
import {Role} from './role';
import {AssignmentStatus} from './AssignmentStatus';

export interface Assignment {
  id: number;
  status: AssignmentStatus | null;
  seen: boolean;
  employee: EmployeeShort;
  shift: ShiftShort;
  role: Role;
}
