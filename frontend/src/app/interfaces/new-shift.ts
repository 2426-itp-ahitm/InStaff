import {NewAssignment} from './new-assignment';

export interface NewShift {
  "shiftCreateDTO": {
    startTime: string,
    endTime: string,
    companyId: number,
  },
  "assignmentCreateDTOs": NewAssignment[],
}
