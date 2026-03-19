import {Assignment} from './assignment';

export interface Shift {
  id: number;
  shiftName: string;
  startTime: Date;
  endTime: Date;
  assignments: Assignment[];
}
