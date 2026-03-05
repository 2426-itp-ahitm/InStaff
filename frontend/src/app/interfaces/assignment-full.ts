import {Employee} from './employee';
import {Shift} from './shift';
import {Role} from './role';

export interface AssignmentFull {
  id: number,
  employee: number,
  shift: Shift,
  role: Role,
  confirmed: boolean,
}
