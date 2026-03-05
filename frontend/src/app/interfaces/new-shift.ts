import {NewAssignment} from './new-assignment';

export interface NewShift {
  shiftName: string;
  shiftCreateDTO: ShiftCreateDTO;
  assignmentCreateDTOs: NewAssignment[],
}

export interface ShiftCreateDTO {
  startTime: string,
  endTime: string,
  companyId: number,
}
